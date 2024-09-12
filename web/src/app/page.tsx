"use client";
import { UploadButton } from "@/lib/uploadthing/uploadthing";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [imgURL, setImgURL] = useState<string | null>(null);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <UploadButton 
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Assuming res is an array of file objects with a URL property
          if (res && res.length > 0) {
            console.log("Files: ", res);
            setImgURL(res[0].url); // Assuming `res[0].url` is the uploaded image URL
            alert("Upload Completed");
          }
        }}
        onUploadError={(error: Error) => {
          // Handle the error
          alert(`ERROR! ${error.message}`);
        }}
      />
      {imgURL && (
        <Image src={imgURL} width={60} height={60} alt="Uploaded image" />
      )}
    </div>
  );
}
