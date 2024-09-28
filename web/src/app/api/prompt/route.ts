import { genAI } from "@/lib/constants/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageURL } = await req.json();

    if (!prompt || !imageURL) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "When analyzing a list of ingredients on a product label, break down each component in a friendly, easy-to-understand way, and in a tabular form. Explain whether each ingredient is good, neutral, or harmful for someone. Provide dietary advice in a supportive tone, suggesting healthier alternatives where needed. Always conclude with a summary that gives clear recommendations while keeping the tone positive and helpful. If possible also try to guess the product.",
    });

    const response = await fetch(imageURL);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    const image = {
      inlineData: {
        data: imageBase64,
        mimeType: response.headers.get("content-type") || "image/png",
      },
    };

    const result = await model.generateContent([prompt, image]);
    const textResult = await result.response.text();

    return NextResponse.json({ message: textResult }, { status: 200 });
  } catch (error) {
    console.error("Error processing the image:", error);
    return NextResponse.json(
      { error: "Error processing the image" },
      { status: 500 }
    );
  }
}
