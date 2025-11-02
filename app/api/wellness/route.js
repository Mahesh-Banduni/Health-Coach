
// app/api/wellness/route.js
import { NextResponse } from "next/server";
import { END, START, StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { loadMedicalArticle } from "../../lib/loaders"; // make sure path matches your loaders.js
import { TavilySearch } from "@langchain/tavily";
import { BufferMemory } from "langchain/memory";

// ========================
// Initialize the LLM
// ========================
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

// ========================
// Memory Store
// ========================
const memory = new BufferMemory({
  memoryKey: "chat_history",
  inputKey: "input",
  outputKey: "response",
  returnMessages: true,
});

// ========================
// Helper to truncate text
// ========================
function truncateText(text, maxLength = 2000) {
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

// ========================
// Extended State Schema
// ========================
const WellnessStateSchema = z.object({
  input: z.string(),
  disease: z.string().optional(),
  urls: z.array(z.string()).optional(),
  titles: z.array(z.string()).optional(),
  contents: z.array(z.string()).optional(),
  summary: z.string().optional(),
  causes: z.array(z.string()).optional(),
  lifestyleTips: z
    .array(
      z.object({
        title: z.string(),
        tip: z.string(),
      })
    )
    .optional(),
  chat_history: z.any().optional(),
  response: z.string().optional(),
});

// ========================
// Nodes
// ========================
const diseaseNode = async (state) => {
  const { input } = state;
  try {
    const prompt = `User input: "${input}"
Extract the most likely disease or medical condition keyword (one or two words only).
If unclear, return the closest matching medical term.`;
    const response = await llm.invoke(prompt);
    const disease = response?.content?.trim();
    return { ...state, disease };
  } catch {
    return { ...state, disease: "" };
  }
};

const articleNode = async (state) => {
  const { disease } = state;
  try {
    const tavily = new TavilySearch({
      apiKey: process.env.TAVILY_API_KEY,
      maxLength: 3,
      topic: "General",
    });

    const response = await tavily.call({ query: disease });

    if (!response?.results?.length) {
      return { ...state, urls: [], titles: [] };
    }

    const topArticles = response.results.slice(0, 3).map((r) => ({
      url: r.url,
    }));

    return {
      ...state,
      urls: topArticles.map((a) => a.url),
    };
  } catch {
    return { ...state, urls: [], titles: [] };
  }
};

const guidelineNode = async (state) => {
  const {urls} = state;
  try {
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const { content, title } = await loadMedicalArticle(url);
        return { title, url, content };
      } catch (err) {
        return { title: "", url, content: "" };
      }
    })
  );
  return {
    ...state,
    urls: results.map((r) => r.url),
    titles: results.map((r) => r.title),
    contents: results.map((r) => r.content),
  };
} catch (err) {
  console.error("Outer catch error:", err.message);
  return { ...state, contents: [], titles: [] };
}
};

const summarizeNode = async (state) => {
  const { input, contents, urls } = state;
  try {
    if (!contents) {
      return { summary: `⚠️ Could not find contents for "${input}"` };
    }

    const snippet = truncateText(contents);

    const prompt = `User describes: ${input}.
You are HEALTH & WELLNESS KNOWLEDGE PROFESSIONAL COACH. Based on ONLY this contents from (${urls}), summarize the condition in two concise paragraphs for the person.
Do not add any information out of the context.
Content:
${snippet}`;

    const response = await llm.invoke(prompt);
    const rawText = response?.content?.trim() || "";
    return { summary: rawText };
  } catch {
    return { summary: "" };
  }
};

const symptomNode = async (state) => {
  const { input, summary, urls } = state;
  try {
    if (!summary) {
      return { causes: [], message: `⚠️ Could not find summary for "${input}"` };
    }

    const snippet = truncateText(summary);

    const prompt = `User describes: ${input}.
You are HEALTH & WELLNESS KNOWLEDGE PROFESSIONAL COACH. Based on this medical summary from (${urls}), list only 5-7 possible medical causes of "${input}" as a point list, should be short wholesome. And dont mention any disclaimer in the end.

Content:
${snippet}`;

    const response = await llm.invoke(prompt);
    const rawText = response?.content?.trim() || "";
    const causes = rawText
      .split("\n")
      .map((item) => item.replace(/^- /, "").trim())
      .filter(Boolean);

    return { causes };
  } catch {
    return { causes: [] };
  }
};

const lifestyleNode = async (state) => {
  const { input, urls, causes = [] } = state;
  try {
    if (!causes.length) {
      return { lifestyleTips: [], message: "⚠️ No causes could be generated." };
    }

    const truncatedCauses = truncateText(causes.join(", "));

    const prompt = `User describes: ${input}.
Causes (from ${urls}):
${truncatedCauses}

You are HEALTH & WELLNESS KNOWLEDGE PROFESSIONAL COACH. Suggest 3-5 actionable lifestyle improvements (diet, exercise, habits) to support wellness no too long, should be short wholesome. And dont mention any disclaimer in the end.
- Example format:
  'Hydrate Your Liver':'Drink plenty of water throughout the day. Adequate…oxins. Aim for at least 8 glasses of water daily.'
`;

    const response = await llm.invoke(prompt);
    const lifestyleText = response?.content?.trim() || "";

    const lifestyleTips = lifestyleText
      .split(/\n+/)
      .map((line) => line.replace(/^\s*\*\s*/, "").trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(.+?):\s*(.+)$/s);
        if (match) {
          const cleanTitle = match[1].replace(/^\*+|\*+$/g, "").trim();
          const cleanTip = match[2].replace(/^\*+|\*+$/g, "").replace(/\s+/g, " ").trim();
          return { title: cleanTitle, tip: cleanTip };
        }
        return null;
      })
      .filter(Boolean);

    return { lifestyleTips };
  } catch {
    return { lifestyleTips: [] };
  }
};

const responseNode = async (state) => {
  const { disease, summary, causes, lifestyleTips } = state;

  let response = `Here’s what I found for **${disease || "your condition"}**:\n\n`;

  if (summary) {
    response += `📝 **Summary:**\n${summary}\n\n`;
  }
  if (causes?.length) {
    response += `⚡ **Possible Causes:**\n${causes.map((c) => `- ${c}`).join("\n")}\n\n`;
  }
  if (lifestyleTips?.length) {
    response += `🌱 **Lifestyle Suggestions:**\n${lifestyleTips
      .map((t) => `- ${t.title}: ${t.tip}`)
      .join("\n")}\n\n`;
  }

  await memory.saveContext({ input: state.input }, { response });
  const mh = await memory.loadMemoryVariables({});
  return { ...state, response, chat_history: mh };
};

// ========================
// Graph
// ========================
const wellnessGraph = new StateGraph(WellnessStateSchema)
  .addNode("extractDisease", diseaseNode)
  .addNode("article", articleNode)
  .addNode("guideline", guidelineNode)
  .addNode("summarize", summarizeNode)
  .addNode("symptom", symptomNode)
  .addNode("lifestyle", lifestyleNode)
  .addNode("respond", responseNode);

wellnessGraph.addEdge(START, "extractDisease");
wellnessGraph.addEdge("extractDisease", "article");
wellnessGraph.addEdge("article", "guideline");
wellnessGraph.addEdge("guideline", "summarize");
wellnessGraph.addEdge("summarize", "symptom");
wellnessGraph.addEdge("symptom", "lifestyle");
wellnessGraph.addEdge("lifestyle", "respond");
wellnessGraph.addEdge("respond", END);

const appGraph = wellnessGraph.compile();

// ========================
// API Handler
// ========================
export async function POST(req) {
  try {
    const body = await req.json();
    const { input } = body;
    if (!input) {
      return NextResponse.json(
        { error: "Missing 'input' in request body" },
        { status: 400 }
      );
    }

    const memoryVars = await memory.loadMemoryVariables({});
    const chatHistory = memoryVars?.chat_history || [];

    // Step 1: Smart classification: decide if input is about disease/health condition
    const routingDecision = await llm.invoke(`
      You are a HEALTH INTELLIGENCE ROUTER AGENT.

      User input: "${input}"
      Chat history: ${JSON.stringify(chatHistory, null, 2)}

      Reply exactly with one word: "GRAPH" , if the user is asking about a bad health condition, disease, symptom, or serious health concern, and only if their is no context of his/her disease or condition in the chat history

      Reply exactly with one word: "CHAT" , if asking personal info, past disease info, summary, causes, and lifestyle tips or general wellness or unrelated,
      or "UNSURE" if it's unclear. Do not add any explanation.
    `);

    let route = routingDecision?.content?.trim()?.toUpperCase();

    // Step 2: Confidence safeguard — default to CHAT if unclear
    if (!route || (route !== "GRAPH" && route !== "CHAT")) {
      route = "CHAT";
    }

    let result;

    if (route === "GRAPH") {
      // User is asking about a disease/condition → query the graph
      result = await appGraph.invoke({ input });
    } else {
      // Normal chat mode
      const response = await llm.invoke(`
        You are a HEALTH & WELLNESS KNOWLEDGE PROFESSIONAL COACH.

        Past context:
        ${JSON.stringify(chatHistory, null, 2)}

        User follow-up:
        "${input}"

        Answer conversationally using only user personal info, past disease info, summary, causes,
        and lifestyle tips in short, concise form.
        Do not invent new diseases.
        If someone asks an out-of-context question, respond only:
        "I’m your Health & Wellness AI Coach — I don’t have information on that, but I’d love to help with your health, fitness, or well-being questions!"
      `);

      const botReply =
        response?.content?.trim() ||
        "⚠️ Sorry, I couldn’t generate a response.";

      await memory.saveContext({ input }, { response: botReply });

      result = {
        input,
        response: botReply,
        chat_history: await memory.loadMemoryVariables({}),
      };
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      "⚠️ Sorry, I couldn’t generate a response.",
      { status: 500 }
    );
  }
}