import { genAI } from "@/lib/constants/gemini";
import { AI } from "@/lib/types/prompt";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_INSTRUCTIONS } from "@/lib/constants/system-instructions";

export const POST = async (req: NextRequest) => {
  try {
    const { history, prompt, ai } = await req.json();

    if (history.length === 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        ai === AI.FOOD
          ? SYSTEM_INSTRUCTIONS.FOOD_AI.Default
          : SYSTEM_INSTRUCTIONS.PERSONAL_CARE_AI.Default,
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history,
    });

    const result = await chatSession.sendMessage(prompt);
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
