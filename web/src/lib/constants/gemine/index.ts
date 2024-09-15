import { GoogleGenerativeAI } from "@google/generative-ai";

const apikey: string = process.env.GEMINI_API_KEY as string;
export const genAI = new GoogleGenerativeAI(apikey);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
