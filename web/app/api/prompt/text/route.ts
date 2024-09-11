import { generationConfig, model, uploadToGemini } from "@/lib/gemini/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // if (!formData.has("image" || !formData.has("prompt"))) {
    //   return NextResponse.json(
    //     { error: "Missing required parameters" },
    //     { status: 400 }
    //   );
    // }

    // let files: any = [];
    // let fileData: any = {};

    // // @ts-ignore
    // if (formData.image) {
    //   // @ts-ignore
    //   files = [await uploadToGemini(formData.image, "image/jpeg")];

    //   fileData = {
    //     mimeType: files[0].mimeType,
    //     fileUri: files[0].uri,
    //   };
    // }

    const chatSession = model.startChat({
      generationConfig,
      history: [
        // {
        // role: "user",
        // parts: [
        //   {
        //     // fileData,
        //   },
        // ],
        // },
      ],
    });
    console.log("Prompt", formData);

    // @ts-ignore
    const result = await chatSession.sendMessage(formData.prompt);

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
