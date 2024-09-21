import { startChatAndSendMessage } from "@/app/(dashboard)/history/gemine";
import { RequestPrompt } from "@/app/(dashboard)/history/page";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, currentMessage }: RequestPrompt = await req.json();
    console.log(messages);
    console.log(currentMessage);
    // Simulate response generation (e.g., AI-generated message)
    /* const modelResponse = {
      role: "model",
      parts: [{ text: `You said: "${currentMessage}". Here's a response from the model.` }],
    }; */
    const modelResponse = await startChatAndSendMessage(messages, currentMessage);
    console.log(modelResponse);
    return NextResponse.json({ messages: [modelResponse], currentMessage });
    // Return the response in the correct format
    //return NextResponse.json({ messages: [modelResponse], currentMessage });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
