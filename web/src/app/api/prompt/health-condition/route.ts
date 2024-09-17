// Request should be in this format
// {
//     "disease": "diabetes",
//     "prompt": "Can I eat this?",
//     "url": "https://i.ibb.co/Y7MG1J9/checken1.jpg"
// }

import { genAI } from '@/lib/constants/gemine';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Extract disease, prompt, and image URL from the request body
    const {
      disease,
      prompt = 'What did you see in this image?',
      url = 'https://i.ibb.co/Y7MG1J9/checken1.jpg',
    } = await req.json();

    if (!disease) {
      return NextResponse.json(
        { error: 'Disease information is required' },
        { status: 400 }
      );
    }

    console.log(disease);

    // Set up the model with the disease-specific system instruction
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `I have ${disease}, so I would like you to only answer questions related to food and how it affects ${disease}. If I ask something not related to food, please kindly respond with: 'I’m here to assist with food-related questions, especially considering ${disease}. Feel free to ask anything about food, and I’ll be happy to help!'`,
    });

    // Fetch the image using the native fetch API
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

    // Generate content based on the prompt and image
    const result = await model.generateContent([prompt, image]);

    console.log(result.response.text());

    // Return the generated text as the response
    return NextResponse.json(
      { message: result.response.text() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
}
