import dotenv from "dotenv";

dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


export const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});