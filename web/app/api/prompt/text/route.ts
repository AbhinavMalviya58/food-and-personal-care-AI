import { promptAsText } from "@/lib/gemini/prompt-text";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await promptAsText(body.prompt);

    return NextResponse.json({
      result: result.response.text(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
