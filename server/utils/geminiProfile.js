const axios = require("axios");

// Removes ```json and ``` from Gemini's Markdown-formatted response
function cleanGeminiJsonResponse(rawText) {
  return rawText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}

async function getUserProfileFromGemini(preferences) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are a financial assistant AI. Based on the user's budget category preferences (in %), determine their financial profile and provide a short insight.

Respond ONLY in this exact JSON format:
{
  "tag": "<short profile label like 'Foodie', 'Health Spender', 'Balanced Spender'>",
  "insight": "<1 sentence personalized analysis of their spending behavior>"
}

Preferences:
${Object.entries(preferences).map(([k, v]) => `- ${k}: ${v}%`).join("\n")}
`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  try {
    const response = await axios.post(url, body);
    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleaned = cleanGeminiJsonResponse(raw);
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini profile generation error:", err.response?.data || err.message);
    return {
      tag: "Balanced Spender",
      insight: "Your spending seems fairly balanced across categories."
    };
  }
}

module.exports = { getUserProfileFromGemini };