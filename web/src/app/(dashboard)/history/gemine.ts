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

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const startChatAndSendMessage = async (history: ChatMessage[], newMessage: string) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts.map(part => part.text).join('') }],
        })),
        generationConfig: {
            maxOutputTokens: 8000,
        },
    });

    try {
        const response = await chat.sendMessage(newMessage);
        console.log(response);

        return response.response.text();
    } catch (error) {
        console.error("Error in startChatAndSendMessage:", error);
        throw error;
    }
}
