// {
//   "prompt": "LOSE",
//   "url": "https://example.com/food-label.jpg"
// }

// or

// {
//   "prompt": "GAIN",
//   "url": "https://example.com/food-label.jpg"
// }


// Request should be in above format

import { genAI } from '@/lib/constants/gemine'; // Assuming the genAI import is correctly configured
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, url } = await req.json();
    let systemInstruction = '';

    // Determine system instruction based on the prompt
    switch (prompt) {
      case 'LOSE':
        systemInstruction =
          "I want to lose weight. Analyze the product label for its nutritional content and provide feedback on whether this product aligns with a weight loss goal. Focus on factors like calories, fat content, sugars, and protein. If the product is high in calories, unhealthy fats, or sugars, recommend alternatives or suggest limiting consumption. If the product is rich in nutrients beneficial for weight loss, such as high protein or fiber, highlight its benefits. Make sure the response is simple and actionable. If I ask something not related to food, please kindly respond with: 'I’m here to assist with food-related questions. Feel free to ask anything about food, and I’ll be happy to help!'.";
        break;

      case 'GAIN':
        systemInstruction =
          "I want to gain weight. Analyze the product label for its nutritional content and provide feedback on whether this product aligns with a weight gain goal. Focus on factors like calories, healthy fats, protein, and overall nutrient density. If the product is high in beneficial fats, protein, or complex carbs, highlight its advantages for healthy weight gain. If the product lacks these nutrients or contains empty calories, recommend more nutritious alternatives. Make sure the response is simple and actionable. If I ask something not related to food, please kindly respond with: 'I’m here to assist with food-related questions. Feel free to ask anything about food, and I’ll be happy to help!'.";
        break;

      default:
        systemInstruction =
          "I want to stay healthy. Analyze the product label for its nutritional content and provide feedback on whether this product supports overall health. Focus on factors like balanced macronutrients, vitamins, minerals, fiber, and low levels of unhealthy additives like sugars and trans fats. If the product is nutrient-dense and promotes long-term health, highlight its benefits. If it contains unhealthy ingredients or lacks essential nutrients, suggest healthier options. Make sure the response is simple and actionable. If I ask something not related to food, please kindly respond with: 'I’m here to assist with food-related questions. Feel free to ask anything about food, and I’ll be happy to help!'.";
        break;
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
    });

    const imageUrl = url || 'https://i.ibb.co/Y7MG1J9/checken1.jpg';

    // Fetch the image data using native fetch
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const image = {
      inlineData: {
        data: imageBase64,
        mimeType: response.headers.get('content-type') || 'image/png',
      },
    };

    const result = await model.generateContent(['start', image]);
    const textResult = await result.response.text();

    return NextResponse.json({ message: textResult }, { status: 200 });
  } catch (error) {
    console.error('Error analyzing food label:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
}
