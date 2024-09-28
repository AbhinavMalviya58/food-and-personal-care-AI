"use client"

import React, { useState } from 'react';
import z from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Send } from "lucide-react"
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Gender, Goal, Preference } from '@/lib/types/diet-plan';
import { createChat } from '@/firebase/chat-db-requests';
import { useAuthContext } from '@/contexts/auth-context.provider';
import { ChatType, Sender } from '@/lib/types/chat';
import { useRouter } from 'next/navigation';

const DietPlanFormSchema = z.object({
  age: z.coerce.number().min(6, { message: "Age must be at least 6" }).max(70, { message: "Age must be no more than 70" }),
  weight: z.coerce.number().positive({ message: "Weight must be a positive number" }),
  height: z.coerce.number().positive({ message: "Height must be a positive number" }),
  gender: z.enum([
    Gender.MALE,
    Gender.FEMALE,
    Gender.OTHERS,
  ]),
  goal: z.enum([
    Goal.GAIN_WEIGHT,
    Goal.LOSE_WEIGHT,
    Goal.MAINTAIN_WEIGHT,
    Goal.GAIN_MUSCLE,
    Goal.MAINTAIN_MUSCLE,
  ]),
  preference: z.enum([
    Preference.VEG,
    Preference.NON_VEG,
    Preference.VEGAN,
    Preference.EGGETARIAN,
  ]),
  targetTime: z.coerce.number().positive({ message: "Time must be a positive number" }),
  targetWeight: z.coerce.number().positive({ message: "Weight must be a positive number" }),
  additionalNotes: z.string().optional()
});

type DietPlanFormValues = z.infer<typeof DietPlanFormSchema>;

const MultiPageForm = () => {
  const [page, setPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const {
    user,
  } = useAuthContext();

  const form = useForm<DietPlanFormValues>({
    resolver: zodResolver(DietPlanFormSchema),
    defaultValues: {
      age: 0,
      weight: 0,
      height: 0,
      gender: Gender.MALE,
      goal: Goal.LOSE_WEIGHT,
      preference: Preference.VEG,
      targetTime: 0,
      targetWeight: 0,
      additionalNotes: ""
    }
  });

  const onSubmit = async (values: DietPlanFormValues) => {
    setIsProcessing(true);

    const response = await fetch("/api/prompt/diet-plan", {
      method: "POST",
      body: JSON.stringify({
        ...values,
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

    // Diet Plan Details in Table Markdown
    const userDietPlanDetails = `## Diet Plan Details \n * Age - ${values.age} \n * Weight - ${values.weight} kgs \n * Height - ${values.height} cms \n * Gender - ${values.gender} \n * Goal - ${values.goal} \n * Preference - ${values.preference} \n * Target Time - ${values.targetTime} months \n * Target Weight - ${values.targetWeight} kgs ${values.additionalNotes ? `\n * Additional Notes - ${values.additionalNotes} \n` : ''}`

    const chatId = await createChat({
      title: "Diet Plan",
      userId: user?.id ?? "test-user-id",
      type: ChatType.FOOD_AI,
      history: [
        {
          role: Sender.User,
          parts: [
            {
              text: userDietPlanDetails,
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

  const nextPage = () => {
    setPage((prev) => Math.min(prev + 1, 2));
  };

  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const renderPage = () => {
    switch (page) {
      case 0:
        return (
          <>
            <FormField
              control={form.control}
              name="age"
              render={() => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your age" {...form.register('age')} />
                  </FormControl>
                  <FormDescription>
                    Your current age in years.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>Male</SelectItem>
                      <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                      <SelectItem value={Gender.OTHERS}>Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your gender.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={() => (
                <FormItem>
                  <FormLabel>Weight (in kgs)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your weight" {...form.register('weight')} />
                  </FormControl>
                  <FormDescription>
                    Your current weight in kilograms.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={() => (
                <FormItem>
                  <FormLabel>Height (in centimeters)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your height" {...form.register('height')} />
                  </FormControl>
                  <FormDescription>
                    Your height in centimeters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Goal.LOSE_WEIGHT}>Weight Loss</SelectItem>
                      <SelectItem value={Goal.GAIN_WEIGHT}>Weight Gain</SelectItem>
                      <SelectItem value={Goal.MAINTAIN_MUSCLE}>Weight Maintain</SelectItem>
                      <SelectItem value={Goal.GAIN_MUSCLE}>Muscle Gain</SelectItem>
                      <SelectItem value={Goal.MAINTAIN_MUSCLE}>Muscle Maintain</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your primary fitness objective.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetWeight"
              render={() => (
                <FormItem>
                  <FormLabel>Target Weight (in kgs)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter target weight" {...form.register('targetWeight')} />
                  </FormControl>
                  <FormDescription>
                    Estimated weight you want to achieve in kilograms.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetTime"
              render={() => (
                <FormItem>
                  <FormLabel>Target Timeline (in months)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter target months" {...form.register('targetTime')} />
                  </FormControl>
                  <FormDescription>
                    Estimated time to achieve your goal in months.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case 2:
        return (
          <>
            <FormField
              control={form.control}
              name="preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your diet preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Preference.VEG}>Vegetarian</SelectItem>
                      <SelectItem value={Preference.NON_VEG}>Non-Vegetarian</SelectItem>
                      <SelectItem value={Preference.VEGAN}>Vegan</SelectItem>
                      <SelectItem value={Preference.EGGETARIAN}>Eggetarian</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Your preferred dietary lifestyle.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additionalNotes"
              render={() => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information or specific requirements"
                      className="resize-none"
                      {...form.register('additionalNotes')}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any other relevant information or special considerations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return (
          <>
            Something went wrong
          </>
        )
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personalized Diet Plan</CardTitle>
        <CardDescription>Let&apos;s create a tailored plan for your health journey</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Progress value={(page + 1) * 33.33} className="w-full" />
            {renderPage()}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {page > 0 && (
          <Button type="button" onClick={prevPage} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        )}
        {page < 2 ? (
          <Button type="button" onClick={nextPage} className="ml-auto">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="ml-auto">
            {
              isProcessing ? "Submitting..." : "Submit"
            }
            <Send className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MultiPageForm;
