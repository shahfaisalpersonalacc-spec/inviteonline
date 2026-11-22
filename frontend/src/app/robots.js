import { SITE_URL } from "@/lib/seo";

// The account area is private; everything public is open to search engines and to AI assistants (ChatGPT,
// Claude, Perplexity, Gemini, Copilot...). The AI crawlers are named so that's explicit: a crawler with its own
// group ignores the "*" one, which is why each group repeats the same rules.
// Invitation pages (/i/...) stay crawlable but say noindex themselves: guests' link previews need to read them.
const PRIVATE = ["/dashboard", "/forgot-password"];
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "meta-externalagent", "CCBot",
];

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
