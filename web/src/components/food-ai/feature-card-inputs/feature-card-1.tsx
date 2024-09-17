'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChat } from "@/firebase/chat-db-requests";
import { ChatType, Sender } from "@/lib/types/chat";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FeatureCard1 = () => {
  const [image, setImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const router = useRouter();

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  }

  const onSubmit = async () => {
    setIsProcessing(true);
    const response = await fetch("/api/prompt/text", {
      method: "POST",
      body: JSON.stringify({
        prompt,
        // imageURL: image, // TODO: Add image upload here (If available)
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setIsProcessing(false);
      return;
    }

    const data = await response.json();

    const chatId = await createChat({
      title: "Food Ingredients",
      userId: "test-user-id",
      type: ChatType.FOOD_AI,
      messages: [
        {
          sender: Sender.User,
          content: prompt,
          // TODO: Add imageUrl here (If available)
        },
        {
          sender: Sender.AI,
          content: data.message,
        }
      ]
    });

    if (!chatId) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(false);
    router.push(`/chat?id=${chatId}`);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => { }}
          variant="app-primary"
        >
          Upload Image
        </Button>
        <Input
          className="flex-1"
          placeholder="e.g. apple, banana, etc."
          type="text"
          value={prompt}
          onChange={handlePromptChange}
        />
        <Button
          onClick={onSubmit}
          variant="app-primary"
        >
          {isProcessing ? "Processing..." : "Submit"}
        </Button>
      </div>
      <div>
        <h1 className="text-star-white text-base">
          Upload an image of the ingredients list on the packaging of the food item or write down about the ingredients included in the food item.
        </h1>
      </div>
    </div>
  );
};

export default FeatureCard1;
