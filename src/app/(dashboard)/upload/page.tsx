"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/uploadthing/uploadthing";
import Image from "next/image";

// Define the type for the image upload response
interface UploadResponse {
  url: string; // URL of the uploaded image
}

export default function Home() {
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to handle image upload completion
  const handleUploadComplete = (res: UploadResponse[] | null) => {
    if (res && res.length > 0) {
      const uploadedImgURL = res[0].url; // Get the first image URL from the response
      setImgURL(uploadedImgURL);
    }
  };

  const handleSubmit = async () => {
    if (!prompt && !imgURL) {
      alert("Please enter a prompt or upload an image.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, imageURL: imgURL }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      <Card className="flex items-end space-x-4 w-full max-w-3xl p-4 rounded-lg shadow-lg">
        {imgURL && (
          <div className="relative w-16 h-16 rounded-md overflow-hidden">
            <Image src={imgURL} layout="fill" objectFit="cover" alt="Uploaded" />
          </div>
        )}

        <div className="flex-grow">
          <Input
            type="text"
            value={prompt}
            placeholder="Type your prompt here..."
            onChange={(e) => setPrompt(e.target.value)}
            className="border-green-600 text-black w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => alert(`Error: ${error.message}`)}
          className="text-green-600 hover:text-blue-700"
        />
      </Card>

      <div className="mt-4 w-full max-w-3xl">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !imgURL || !prompt} // Disable button if loading or either image or prompt is missing
          className={`w-full p-3 rounded-lg transition-colors ${
            isLoading || !imgURL || !prompt
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-800 text-white hover:bg-green-600"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>

      {response && (
        <Card className="mt-6 w-full max-w-3xl p-4 rounded-lg shadow-lg">
          <h2 className="font-bold mb-2">Response from server:</h2>
          <pre className="whitespace-pre-wrap break-words bg-gray-100 p-2 rounded-md">
            {response}
          </pre>
        </Card>
      )}
    </div>
  );
}