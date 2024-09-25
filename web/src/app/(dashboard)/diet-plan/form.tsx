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

const PersonalCareFormSchema = z.object({
  age: z.coerce.number().min(6, { message: "Age must be at least 6" }).max(70, { message: "Age must be no more than 70" }),
  weight: z.coerce.number().positive({ message: "Weight must be a positive number" }),
  height: z.coerce.number().positive({ message: "Height must be a positive number" }),
  goal: z.enum(["weightLoss", "weightGain", "weightMaintain","muscleGain","muscleMaintenance"]),
  preference: z.enum(["Veg", "Non-Veg", "Vegan"]),
  timeToAchieve: z.coerce.number().positive({ message: "Time must be a positive number" }),
  additionalNote: z.string().optional()
});

type PersonalCareFormValues = z.infer<typeof PersonalCareFormSchema>;

const MultiPageForm = () => {
    const [page, setPage] = useState(0);

    const form = useForm<PersonalCareFormValues>({
        resolver: zodResolver(PersonalCareFormSchema),
        defaultValues: {
            age: 0,
            weight: 0,
            height: 0,
            goal: "weightLoss",
            preference: "Veg",
            timeToAchieve: 0,
            additionalNote: ""
        }
    });

    const onSubmit = (values: PersonalCareFormValues) => {
        console.log(values);
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
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your age" {...field} />
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
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (kg)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your weight" {...field} />
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
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Height (cm)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your height" {...field} />
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
                                            <SelectItem value="weightLoss">Weight Loss</SelectItem>
                                            <SelectItem value="weightGain">Weight Gain</SelectItem>
                                            <SelectItem value="weightMaintain">Weight Maintenance</SelectItem>
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
                            name="timeToAchieve"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Target Timeline (days)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter target days" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Estimated time to achieve your goal in days.
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
                                            <SelectItem value="Veg">Vegetarian</SelectItem>
                                            <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                                            <SelectItem value="Vegan">Vegan</SelectItem>
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
                            name="additionalNote"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional information or specific requirements"
                                            className="resize-none"
                                            {...field}
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
                <CardTitle>Persaonalized Diet Plan</CardTitle>
                <CardDescription>Let's create a tailored plan for your health journey</CardDescription>
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
                        Submit <Send className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default MultiPageForm;