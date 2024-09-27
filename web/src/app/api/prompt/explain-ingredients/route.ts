import { genAI } from "@/lib/constants/gemine";
import { AI } from "@/lib/types/prompt";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_INSTRUCTIONS } from "./system-instructions";

export const POST = async (req: NextRequest) => {
  try {
    const { imageUrl, prompt, mimeType, ai } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        ai === AI.FOOD
          ? SYSTEM_INSTRUCTIONS.FOOD_AI
          : SYSTEM_INSTRUCTIONS.PERSONAL_CARE_AI,
    });

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    const image = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, image]);
    const textResult = result.response.text();

    return NextResponse.json({ message: textResult }, { status: 200 });
  } catch (error) {
    console.error("Error processing the image:", error);
    return NextResponse.json(
      { error: "Error processing the image" },
      { status: 500 }
    );
  }
};
