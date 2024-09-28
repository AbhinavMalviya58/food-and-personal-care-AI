import { genAI } from "@/lib/constants/gemini";
import { AI } from "@/lib/types/prompt";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_INSTRUCTIONS } from "@/lib/constants/system-instructions";

export const POST = async (req: NextRequest) => {
  try {
    const { ai } = await req.json();

    const aiType = ai === AI.FOOD ? "food" : "personal care product";
    const prompt = `Generate a random ${aiType} fact.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        ai === AI.FOOD
          ? SYSTEM_INSTRUCTIONS.FOOD_AI.RandomFact
          : SYSTEM_INSTRUCTIONS.PERSONAL_CARE_AI.RandomFact,
    });
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
};
