import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatPart {
    text: string;
}

export interface ChatMessage {
    role: "model" | "user";
    parts: ChatPart[];
}

const GeminiApiKey: string = process.env.GEMINI_API_KEY as string;
export const genAI = new GoogleGenerativeAI(GeminiApiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",systemInstruction : "you are a health and nutrition expert whose job is to help people with their health and nutrition questions" });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

export const startChatAndSendMessage = async (history: ChatMessage[], newMessage: string) => {
    const chat = model.startChat({
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts.map(part => part.text).join('') }],
        })),
        generationConfig
    });

    try {
        const result = await chat.sendMessage(newMessage);
        const response = await result.response;
        const text = response.text();
        
        return text;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error in startChatAndSendMessage:", error.message);
            if (error.message.includes("RECITATION")) {
                return "I apologize, but I cannot provide a response as it may contain recited content. Could you please rephrase your request or ask something different?";
            }
            if (error.message.includes("Could not parse the CachedContent name")) {
                console.error("Error parsing CachedContent name:", error.message);
                return "I'm sorry, but there was an error processing your request. Please try again later.";
            }
        }
        throw error;
    }
}
