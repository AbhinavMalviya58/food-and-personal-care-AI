"use client";

import { UploadButton } from "@/lib/uploadthing/uploadthing";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  return (
    <div className="flex flex-col justify-center items-center min-h-screenv text-black p-6 bg-gray-100">
      {/* Chat-like input section */}
      <div className="flex items-end space-x-4 w-full max-w-3xl bg-white p-4 rounded-lg shadow-lg">
        {/* Image preview area */}
        {imgURL && (
          <div className="relative w-16 h-16 rounded-md overflow-hidden">
            <Image src={imgURL} layout="fill" objectFit="cover" alt="Uploaded" />
          </div>
        )}

        {/* Input field */}
        <div className="flex-grow">
          <input
            type="text"
            value={prompt}
            placeholder="Type your prompt here..."
            onChange={(e) => setPrompt(e.target.value)}
            className="text-black w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload button */}
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              setImgURL(res[0].url);
            }
          }}
          onUploadError={(error: Error) => alert(`Error: ${error.message}`)}
          className="text-blue-500 hover:text-blue-700"
        />
      </div>

      {/* Submit button */}
      <div className="mt-4 w-full max-w-3xl">
        <button
          onClick={() => {
            if (prompt || imgURL) {
              alert("Submitted!");
            } else {
              alert("Please enter a prompt or upload an image.");
            }
          }}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </div>

      {/* JSON Preview */}
      <div className="mt-6 w-full max-w-3xl bg-white p-4 rounded-lg shadow-lg">
        <h2 className="font-bold mb-2">Generated JSON:</h2>
        <pre className="whitespace-pre-wrap break-words bg-gray-100 p-2 rounded-md">
          {JSON.stringify({ prompt, imageURL: imgURL }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
