const axios = require("axios");

// Removes ```json and ``` from Gemini's Markdown-formatted response
function cleanGeminiJsonResponse(rawText) {
    return rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
}

async function getSuggestionsFromGemini(preferences, profileTag, topCategories) {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
You are a smart personal finance assistant. Based on the user's profile and budget distribution, give 3 helpful budgeting suggestions.

Respond ONLY in this exact JSON format: 
[
  "Suggestion 1",
  "Suggestion 2",
  "Suggestion 3"
]

User Profile: ${profileTag}

Spending Preferences:
${Object.entries(preferences).map(([k, v]) => `- ${k}: ${v}%`).join("\n")}

Top Spending Categories:
${topCategories.map(c => `- ${c.category} (${c.percent}%)`).join("\n")}
`;

    const body = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    try {
        const response = await axios.post(url, body);
        const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        const cleaned = cleanGeminiJsonResponse(rawText);
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [cleaned];
    } catch (err) {
        console.error("Gemini suggestion generation error:", err.response?.data || err.message);
        return ["Could not generate personalized suggestions at this time."];
    }
}

module.exports = { getSuggestionsFromGemini };