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
        const imageUrl = ["https://utfs.io/f/8d8DWWhM1OVp2kumzdiU1gzqky8sLW2cXlmnGNAFH0jJ5dth","https://utfs.io/f/8d8DWWhM1OVpHfRbzpkANuvKlFgSzpIMj7odOn5EQRrk9L4V"];
        // Fetch the image data
        const imageResponse = await fetch(imageUrl[1]);
        if (!imageResponse.ok) {
            throw new Error("Failed to fetch image");
        }
        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString("base64");

        const chat = model.startChat({
             history : [
                {
                    role: "user",
                    parts: [{ text: "hii" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hello! 👋 \n" }],
                },
                {
                    role: "user",
                    parts: [
                        { text: `what is this image: ${imageUrl[0]}` },
                        {
                            inlineData: {
                                mimeType: imageResponse.headers.get("content-type") || "image/jpeg",
                                data: imageBase64
                            }
                        }
                    ]
                },
                {
                    role : "model",
                    parts : [
                        {text : "The image shows a list of ingredients for a food product. It contains a lot of information about the food, including:\n\n* **The primary ingredients:** Gram pulse flour, edible vegetable oil (cotton seed, corn, palmolein, ground nut and rice bran), gram pulse, lentil, peanuts, rice flakes, potatoes, tepary beans flour, iodised salt, black salt powder, spinach powder, rice powder, edible starch.\n* **A list of spices and condiments:** Red chili powder, turmeric powder, mango powder, black pepper powder, ginger powder, clove powder, mace powder, nutmeg powder, cumin powder, fenugreek seeds powder, coriander powder, bay leaves powder, mint leaves powder, cardamom powder, asafoetida powder\n* **Additives:** Acidity regulator (INS 330), anticaking agent (INS 551), and synthetic food colour (INS 133).\n* **Allergen Information:** The product contains peanuts.\n\nIt appears to be a list of ingredients from a package of some type of Indian snack food.  \n\nLet me know if you have any questions about these ingredients or if you want to know more about this product! \n"}
                    ]
                },
                {
                    role: "user",
                    parts: [
                        { text: `what is this image: ${imageUrl[1]}` },
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
