'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/auth-context.provider";
import { createChat } from "@/firebase/chat-db-requests";
import { ChatType, Sender } from "@/lib/types/chat";
import { AI } from "@/lib/types/prompt";
import { UploadButton, UploadResponse } from "@/lib/uploadthing/uploadthing";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FeatureCard1 = () => {
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const router = useRouter();

  const {
    user,
  } = useAuthContext();

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  }

  const handleUploadComplete = (res: UploadResponse[] | null) => {
    if (res && res.length > 0) {
      const uploadedImgURL = res[0].url;
      setImgURL(uploadedImgURL);
    }
  };

  const onSubmit = async () => {
    setIsProcessing(true);

    const response = await fetch("/api/prompt/explain-ingredients", {
      method: "POST",
      body: JSON.stringify({
        prompt,
        imageUrl: imgURL,
        mimeType: "image/jpeg",
        ai: AI.PERSONAL_CARE,
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
      title: "Product Ingredients",
      userId: user?.id ?? "test-user-id",
      type: ChatType.PERSONAL_CARE_AI,
      history: [
        {
          role: Sender.User,
          parts: [
            {
              fileData: {
                fileUri: imgURL!,
                mimeType: "image/jpeg",
              },
            },
            {
              text: prompt,
            }
          ],
        },
        {
          role: Sender.Model,
          parts: [
            {
              text: data.message,
            },
          ],
        },
      ],
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
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => alert(`Error: ${error.message}`)}
          className="text-app-primary hover:text-app-primary/90"
        />
        <Input
          className="flex-1"
          placeholder="e.g. shampoo, face wash, etc."
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
        <p className="text-star-white text-sm">
          Upload an image of the ingredients list on the packaging of the personal care product or write down about the ingredients included in the personal care product.
        </p>
      </div>
    </div>
  );
};

export default FeatureCard1;
