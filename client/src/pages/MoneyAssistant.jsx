// src/pages/MoneyAssistant.jsx
import React, { useState } from "react";
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';

const MoneyAssistant = () => {
    const [messages, setMessages] = useState([
        { type: "bot", text: "Hi! I’m your Money Assistant 💸. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { type: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Show a temporary loading message
        const loadingMsg = { type: "bot", text: "Typing..." };
        setMessages((prev) => [...prev, loadingMsg]);

        try {
            const res = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });

            const data = await res.json();

            // Delay showing the real reply by 2 seconds
            setTimeout(() => {
                setMessages((prev) => {
                    // Remove the loading message and add the real reply
                    const updated = [...prev];
                    updated.pop(); // remove "Typing..."
                    updated.push({ type: "bot", text: data.reply || "Sorry, I couldn’t understand that." });
                    return updated;
                });
            }, 2000);
        } catch (err) {
            setMessages((prev) => {
                const updated = [...prev];
                updated.pop(); // remove "Typing..."
                updated.push({ type: "bot", text: "Something went wrong. Please try again later." });
                return updated;
            });
        }
    };


    return (
        <div className="h-[90vh] flex flex-col items-center bg-gradient-to-br from-blue-50 to-green-100 p-4">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl flex flex-col flex-grow overflow-hidden">
                <div className="bg-blue-600 text-white text-xl font-bold px-4 py-3">
                    💬 Money Assistant
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`max-w-[70%] px-4 py-2 rounded-xl ${msg.type === "bot"
                                ? "bg-blue-100 text-left text-gray-800"
                                : "bg-green-200 ml-auto text-right text-black"
                                }`}
                        >
                            {msg.text === "Typing..." ? (
                                <span className="animate-pulse">Typing...</span>
                            ) : (
                                msg.text
                            )}

                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 border-t p-3">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        type="text"
                        placeholder="Ask me something..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
                    />
                    <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-full">
                        <SendTwoToneIcon size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoneyAssistant;
