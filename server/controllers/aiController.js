

// controllers/aiController.js
const axios = require("axios");

const chatWithAI = async (req, res) => {
    const { message } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `
You are a smart financial assistant named "Money Assistant 💸".
Reply concisely and in a friendly tone to financial queries.

User: ${message}
Assistant:
`;

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
        contents: [
            {
                parts: [{ text: prompt }]
            }
        ]
    };

    try {
        const response = await axios.post(url, body);
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";

        return res.json({ reply: text.trim() });
    } catch (error) {
        console.error("Gemini error:", error.response?.data || error.message);
        return res.status(500).json({ reply: "An error occurred while talking to the assistant." });
    }
};

module.exports = { chatWithAI };

