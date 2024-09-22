import { GoogleGenerativeAI } from "@google/generative-ai";

import { NextResponse } from "next/server";

const GeminiApiKey: string = process.env.GEMINI_API_KEY as string
export const genAI = new GoogleGenerativeAI(GeminiApiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction : "you are a health and nutrition expert whose job is to help people with their health and nutrition questions" });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function POST(req: Request) {
    //image URL 
    // History
    // prompt
    try {
        const { prompt } = await req.json();
        const imageUrl = ["https://utfs.io/f/8d8DWWhM1OVp2kumzdiU1gzqky8sLW2cXlmnGNAFH0jJ5dth"];
        // Fetch the image data
        const imageResponse = await fetch(imageUrl[0]);
        if (!imageResponse.ok) {
            throw new Error("Failed to fetch image");
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString("base64");
        //console.log(imageBase64);
        

        const chat = model.startChat({
             history : [
                {
                    role: "user",
                    parts: [
                        /* { text: `what is this image: ${imageUrl[0]}` }, */
                        {
                            inlineData: {
                                mimeType: imageResponse.headers.get("content-type") || "image/jpeg",
                                data: imageBase64
                            }
                        }
                    ]
                },
            ],
            generationConfig
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();


        return NextResponse.json({ 
            message: text
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "An error occurred while processing the request" }, { status: 500 });
    }
}
