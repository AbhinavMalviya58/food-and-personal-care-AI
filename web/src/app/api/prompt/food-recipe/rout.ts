import { genAI } from '@/lib/constants/gemine';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Extract the prompt and image URL from the request body
    const {
      prompt = 'What is the recipe.',
      url = 'https://i.ibb.co/Y7MG1J9/checken1.jpg',
    } = await req.json();

    // Fetch the image data using native fetch
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    // Convert the image to base64
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const image = {
      inlineData: {
        data: imageBase64,
        mimeType: response.headers.get('content-type') || 'image/png',
      },
    };

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `The user will upload a photo or provide the name of a dish. If the dish is recognized, provide a healthy version of its recipe, focusing on nutrient-rich ingredients, reducing unhealthy fats, sugars, and excessive calories. If the uploaded photo is unclear or not related to food, politely ask the user to upload a clearer image or remind them that you can only assist with food-related inquiries. If possible, give the response in markdown form.`,
    });

    // Pass both the prompt and the image to the model
    const result = await model.generateContent([prompt, image]);

    // Send back the model's response
    return NextResponse.json(
      { message: result.response.text() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing the image:', error);
    return NextResponse.json(
      { error: 'Error processing the image' },
      { status: 500 }
    );
  }
}
