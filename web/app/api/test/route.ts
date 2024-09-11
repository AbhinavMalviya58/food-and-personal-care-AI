import { NextResponse } from "next/server";

type PromptRequest = {
  image: string;
  question?: string;
};

export async function POST(req: Request) {
  try {
    const { image, question }: PromptRequest = await req.json(); // Await req.json() as it returns a promise
    if (!image) {
      return NextResponse.json({ question }); console.log(question);
    }
   
    
    return NextResponse.json({ image, question });
    console.log({image, question});
    
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while processing the request" }, { status: 500 });

  }
}

