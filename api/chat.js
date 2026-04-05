import axios from "axios";

export default async function handler(req, res) {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "No message provided" });
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/auto",
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: message }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            reply: response.data.choices[0].message.content
        });

    } catch (error) {
        console.error("AI ERROR:", error.response?.data || error.message);

        // ✅ ALWAYS RETURN JSON
        return res.status(500).json({
            reply: "⚠️ AI server error"
        });
    }
}