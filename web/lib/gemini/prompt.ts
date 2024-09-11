import { generationConfig, model } from "./config";

export const prompt = async (formData: { prompt: string; image: string }) => {
  // if (!formData.has("image" || !formData.has("prompt"))) {
  //   return null;
  // }
  let files: any = [];
  let fileData: any = {};
  // @ts-ignore
  if (formData.image) {
    // @ts-ignore
    files = [await uploadToGemini(formData.image, "image/jpeg")];
    fileData = {
      mimeType: files[0].mimeType,
      fileUri: files[0].uri,
    };
  }

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData,
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);

  return result;
};
