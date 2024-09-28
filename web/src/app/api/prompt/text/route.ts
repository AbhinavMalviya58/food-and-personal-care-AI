import { genAI } from "@/lib/constants/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([prompt]);
    const textResult = result.response.text();

    return NextResponse.json({ message: textResult }, { status: 200 });
  } catch (error) {
    console.error("Error processing the image:", error);
    return NextResponse.json(
      { error: "Error processing the image" },
      { status: 500 }
    );
  }
}
