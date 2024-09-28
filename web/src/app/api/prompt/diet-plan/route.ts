import { genAI } from "@/lib/constants/gemini";
import { SYSTEM_INSTRUCTIONS } from "@/lib/constants/system-instructions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      age,
      weight,
      height,
      goal,
      preference,
      targetTime,
      targetWeight,
      additionalNotes,
    } = await req.json();

    // Diet Plan Prompt
    const prompt = `I am a ${age} years old person who weighs ${weight} kgs and is ${height} cm tall. I want to ${goal} and my preference is ${preference}. I want to achieve my target weight of ${targetWeight} kgs in ${targetTime} months. ${additionalNotes}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTIONS.FOOD_AI.DietPlan,
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
