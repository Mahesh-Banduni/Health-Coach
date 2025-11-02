import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

// Optional: validate that the URL exists
export async function validateUrl(url) {
  try {
    let res = await fetch(url, { method: "HEAD" });

    // Some sites block HEAD, so fall back to GET
    if (!res.ok || res.status >= 400) {
      res = await fetch(url, { method: "GET" });
    }
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Load and extract main article content from any website.
 * @param {string} url - URL of the article
 * @param {string} title - optional title to store
 * @returns {Object} { url, title, content }
 */
export async function loadMedicalArticle(url) {
  // Validate URL exists
  const valid = await validateUrl(url);
  if (!valid) {
    throw new Error(`No page found at: ${url}`);
  }

  // Fetch full HTML
  const res = await fetch(url);
  const html = await res.text();

  // Parse with JSDOM + Readability
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article?.textContent) {
    throw new Error(`Could not extract content from ${url}`);
  }

  // Title: prefer <title>, else article.title
  const extractedTitle =
    dom.window.document.querySelector("title")?.textContent?.trim() ||
    article.title ||
    "";

  // Clean content: remove \n, \t, and collapse multiple spaces
  const cleanedContent = article.textContent
    .replace(/[\n\t]+/g, " ")   // remove newlines/tabs
    .replace(/\s\s+/g, " ")     // collapse multiple spaces
    .trim()
    .slice(0, 1200);

  return {
    url,
    title: extractedTitle,
    content: cleanedContent,
  };
}


