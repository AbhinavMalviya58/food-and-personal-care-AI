'use client';

import React, { useState } from "react";
import { FaRunning } from "react-icons/fa";
import InputRender from "./input-render";
import { ModeToggle } from "@/components/toogle";

const FOOD_AI_FEATURE_CARDS = [
  {
    id: '1',
    description: "I want to find out ingredients in my food are healthy or not",
  },
  {
    id: '2',
    description: "I am suffering from a health condition and should I eat it?",
  },
  {
    id: '3',
    description: "Create a personalized diet plan tailored to my needs",
  },
  {
    id: '4',
    description: "How much protein, carbs, and fats are in my food?",
  },
  {
    id: '5',
    description: "Give me a random food fact",
  },
];

type FeatureCard = {
  id: string;
  description: string;
}

const FoodPage = () => {
  const [selectedCard, setSelectedCard] = useState<FeatureCard>();

  const handleCardSelection = (card: FeatureCard) => {
    setSelectedCard(card);
  }

  return (
    <div className="flex p-8 gap-4 h-screen bg-app-dark">
      <div className="flex flex-col items-center w-[80%] gap-36 mx-auto">
        <div className="flex flex-1 flex-col items-center gap-16">
          <h1 className="flex gap-3 text-star-white cursor-pointer text-5xl font-secondary">
            Better <span className="text-app-primary flex gap-2 items-center">Health <FaRunning size={48} /></span>
            <ModeToggle /></h1>

          <div className="flex flex-wrap gap-6 items-center justify-center">
            {
              FOOD_AI_FEATURE_CARDS.map((card) => (
                <div
                  key={card.id}
                  className={`flex max-w-96 min-h-24 items-center gap-3 text-star-white cursor-pointer p-5 rounded-lg border-4 ${selectedCard?.id === card.id ? 'border-app-primary' : 'border-gray-1 hover:border-gray-2'}`}
                  onClick={() => handleCardSelection(card)}
                >
                  <p className="text-center text-base">{card.description}</p>
                </div>
              ))
            }
          </div>
        </div>
        <div className="w-full flex justify-end items-end gap-4 min-h-64 p-8">
          {
            selectedCard && (
              <InputRender id={selectedCard.id} />
            )
          }
        </div>
      </div>
    </div>
  )
};

export default FoodPage;
