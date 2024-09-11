import { generationConfig, model } from "./config";

export const promptAsText = async (text: string) => {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  // @ts-ignore
  const result = await chatSession.sendMessage(text);

  return result;
};
