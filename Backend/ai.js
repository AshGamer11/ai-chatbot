import axios from "axios";


export const getAIResponse = async (messages) => {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/auto",
                messages: messages
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
                }
            }
        );

        return response.data.choices[0].message.content;

    } catch (error) {
        console.error(error.response?.data || error.message);
        return "⚠️ AI error";
    }
};