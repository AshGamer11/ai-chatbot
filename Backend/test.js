import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
    try {
        const res = await axios({
            method: "post",
            url: "https://router.huggingface.co/hf-inference/models/bigscience/bloom-560m",
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            data: {
                inputs: "Hello, how are you?"
            }
        });

        console.log("✅ SUCCESS:", res.data);

    } catch (err) {
        console.log("❌ ERROR:", err.response?.data || err.message);
    }
};

test();