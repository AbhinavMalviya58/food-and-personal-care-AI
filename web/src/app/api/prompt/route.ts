import { genAI } from "@/lib/gemeni";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Extract prompt and imageURL from the request body
    const { prompt, imageURL } = await req.json();

    if (!prompt || !imageURL) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetch the image data using native fetch
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
    return NextResponse.json({ error: "Error processing the image" }, { status: 500 });
  }
}
