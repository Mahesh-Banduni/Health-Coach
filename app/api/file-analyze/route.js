import { NextResponse } from "next/server";
import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BufferMemory } from "langchain/memory";
import { z } from "zod";
import { createWorker } from 'tesseract.js';

// ========================
// LLM & Memory
// ========================
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

const memory = new BufferMemory({
  memoryKey: "chat_history",
  inputKey: "input",
  outputKey: "response",
  returnMessages: true,
});

// ========================
// Helpers
// ========================
const truncateText = (text, maxLength = 2000) =>
  text.length > maxLength ? text.slice(0, maxLength) : text;

// ========================
// State Schema
// ========================
const FileStateSchema = z.object({
  input: z.string(),
  file: z.any().nullable(), // raw file buffer + metadata
  fileSummary: z.string().optional(),
  imageAnalysis: z.string().optional(),
  response: z.string().optional(),
  chat_history: z.array(z.any()).optional(),
});

// ========================
// Nodes
// ========================
const fileNode = async (state) => {
  const { file } = state;
  if (!file) return state;

  try {
    const prompt = `Analyze the document "${file.originalFilename}" and summarize any relevant health or wellness info.`;
    const response = await llm.invoke(prompt);
    return { ...state, fileSummary: response?.content?.trim() || "" };
  } catch {
    return { ...state, fileSummary: "⚠️ Could not analyze the document." };
  }
};

const imageNode = async (state) => {
  const { file } = state;
  if (!file || !file.mimetype.startsWith("image/")) return state;

  try {
    // OCR using tesseract.js-node createWorker
    const worker = await createWorker({
      logger: (m) => console.log("OCR:", m),
    });

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const { data: { text } } = await worker.recognize(file.buffer);

    await worker.terminate();

    if (!text.trim()) {
      return { ...state, imageAnalysis: "⚠️ No text detected in the image for analysis." };
    }

    const prompt = `Analyze the following text extracted from an image and summarize any health/wellness information:\n\n${text}`;
    const response = await llm.invoke(prompt);

    return { ...state, imageAnalysis: response?.content?.trim() || "⚠️ Could not generate summary from image text." };
  } catch (err) {
    console.error("OCR/Image analysis error:", err);
    return { ...state, imageAnalysis: "⚠️ Could not analyze the image." };
  }
};

const summarizeNode = async (state) => {
  const { input, fileSummary, imageAnalysis } = state;
  const combinedContent = [fileSummary, imageAnalysis].filter(Boolean).join("\n\n");
  if (!combinedContent) return { response: "⚠️ No content to summarize." };

  const snippet = truncateText(combinedContent);
  const prompt = `User input: ${input}\nSummarize the following content in two concise paragraphs:\n${snippet}`;
  const response = await llm.invoke(prompt);

  return { ...state, response: response?.content?.trim() || "⚠️ Could not generate summary." };
};

// ========================
// Graph (Sequential execution)
// ========================
const fileGraph = new StateGraph(FileStateSchema)
  .addNode("processFile", fileNode)
  .addNode("processImage", imageNode)
  .addNode("summarize", summarizeNode);

fileGraph.addEdge(START, "processFile");
fileGraph.addEdge("processFile", "processImage");
fileGraph.addEdge("processImage", "summarize");
fileGraph.addEdge("summarize", END);

const appGraph = fileGraph.compile();

// ========================
// POST Handler
// ========================
export async function POST(req) {
  try {
    const formData = await req.formData();

    const input = formData.get("input")?.toString() || "";
    const file = formData.get("file");

    let fileData = null;
    if (file && file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fileData = {
        originalFilename: file.name,
        mimetype: file.type,
        buffer,
      };
    }

    const result = await appGraph.invoke({ input, file: fileData });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("File Analyze POST error:", err);
    return NextResponse.json("⚠️ Something went wrong.", { status: 500 });
  }
}
