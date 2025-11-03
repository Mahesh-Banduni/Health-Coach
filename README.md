# AI-Powered Health & Wellness Knowledge Coach  
_A Personalized AI Health & Fitness Guidance Chatbot built with Next.js, TailwindCSS, LangChain, LangGraph & Tavily_

The **AI-Powered Health & Wellness Knowledge Coach** is an intelligent conversational chatbot designed to provide **educational health insights, symptom-based wellness guidance, and personalized lifestyle improvement recommendations**.  
It uses **LLM-powered reasoning**, **trusted web-sourced medical knowledge**, and **contextual memory** to simulate a personalized health coaching experience.

> ⚠️ *This system does not provide medical diagnoses. It offers educational health guidance only.*

---

## Features

• **AI Health & Wellness Chatbot** — Provides educational guidance for symptoms, habits, diet & lifestyle  
• **Symptom-to-Cause Reasoning** — LangGraph maps symptoms → possible causes → lifestyle improvements  
• **Smart Medical Knowledge Retrieval with Tavily API** — Fetches top 3 reliable medical articles + source links  
• **Multi-Source Content Extraction** — Summarizes and extracts insights (beyond Wikipedia)  
• **Conversational Memory** — LangChain memory stores user health context for continuous, personalized chats  
• **Multi-Modal AI Support** *(in progress)* — Understands medical reports & documents, not just text  
• **Modern UI** — Next.js + TailwindCSS chat interface  
• **Gemini-Powered Reasoning** — Uses Google Gemini for interpretation, summarization & guidance  
• **Modular AI Pipeline** — Extensible for nutrition plans, workout programs, and wearable integrations  

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js, TailwindCSS |
| **AI / LLM Orchestration** | LangChain, LangGraph |
| **Search & Knowledge Retrieval** | **Tavily Web Search API** |
| **LLM Model** | Google Gemini |
| **Data Extraction** | Tavily result scraping + targeted web scraping |
| **Memory** | LangChain Conversational Memory |

---

## System Workflow

```mermaid
flowchart TD
    A["User Inputs Symptoms or Health Query"] --> B["LLM Interprets Possible Health Condition"]
    B --> C["Tavily API Fetches Top 3 Reliable Medical Sources"]
    C --> D["Extract and Scrape Web Content"]
    D --> E["LLM Summarizes Content and Extracts Key Insights"]
    E --> F["Generate Causes and Personalized Lifestyle Recommendations"]
    F --> G["Store Conversation and User Health Context in Memory"]
