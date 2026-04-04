import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getAIResponse } from "./ai.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let chatHistory = [
  {
    role: "system",
    content: "You are a helpful, smart, friendly AI assistant. Answer clearly and simply."
  }
];

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    chatHistory.push({ role: "user", content: message });

    const reply = await getAIResponse(chatHistory);

    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });
});

app.listen(3000, () => console.log("Server running on 3000"));