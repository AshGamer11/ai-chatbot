import axios from "axios";

export default async function handler(req, res) {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/auto",
                messages: [
                    { role: "user", content: message }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(200).json({
            reply: response.data.choices[0].message.content
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            reply: "⚠️ AI error"
        });
    }
}