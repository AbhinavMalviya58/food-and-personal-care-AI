import { genAI } from "@/lib/constants/gemine";
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
      systemInstruction:
        "You are an health and diet plan expert. Generate a diet plan for a person based on their age, weight, height, goal, preference, target time, target weight, and additional notes. Provide a detailed diet plan that includes the number of meals, the type of food, and the quantity of food. The diet plan should be tailored to the person's needs and preferences. Meals per day should be between 3-6. The diet plan should be between 1000-3000 calories per day. Prepare one week of diet plan that can be repeated reach week with different options until the target weight is achieved. Create it in a way that is easy to follow and will help the person achieve their target weight in the specified time frame. The diet plan should be healthy, balanced, and nutritious. Provide a detailed explanation of the diet plan and the reasons behind the food choices. Include any additional information that you think is relevant.",
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
