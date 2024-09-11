"use client";
import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { Base64 } from "js-base64";
import MarkdownContent from "./markdown-content";
import { DUMMY_PROMPT } from "@/constants/prompt";

export const SubmitType = z.object({
  image: z.string().optional(),
  prompt: z.string().min(1, "Question is required"),
});

const ImageBase: React.FC = () => {
  const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState<string | undefined>();

  const form = useForm<z.infer<typeof SubmitType>>({
    resolver: zodResolver(SubmitType),
    defaultValues: {
      image: undefined,
      prompt: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    console.log("File:", file);
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setBase64Image(reader.result);
          // Extract the base64 string without the data URL prefix
          const base64String = reader.result.split(',')[1];
          form.setValue("image", base64String);
          console.log("Is valid base64:", Base64.isValid(base64String));
        }
      };

      reader.readAsDataURL(file);
      // setImage(file);
    } else {
      setBase64Image(undefined);
      form.setValue("image", undefined);
    }
  };

  const onSubmit = async (values: z.infer<typeof SubmitType>) => {
    setIsPending(true);
    setError(undefined);
    setSuccess(undefined);

    console.log("Submitting values:", values);

    try {
      const response = await fetch("http://localhost:3000/api/prompt/text", {
        body: JSON.stringify(values.prompt),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Data submitted successfully");
        setResponse(data.result);
      } else {
        throw new Error(data.error || "Failed to submit data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) =>
      console.log(name, type, value)
    );
    return () => subscription.unsubscribe();
  }, [form]);

  console.log("Dumb prompt", DUMMY_PROMPT);

  return (
    <div className="flex flex-col gap-10">
      <Card className="flex gap-4 p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                  </FormControl>
                  <FormDescription>Upload an image file.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {base64Image && (
              <Image
                className="object-contain"
                width={100}
                alt="Uploaded image"
                height={100}
                src={base64Image}
              />
            )}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Ask your question" {...field} />
                  </FormControl>
                  <FormDescription>Type your question here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </Card>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      {<div className="text-gray-500">
        <MarkdownContent markdown={DUMMY_PROMPT} />
      </div>}
    </div>
  );
};

export default ImageBase;
