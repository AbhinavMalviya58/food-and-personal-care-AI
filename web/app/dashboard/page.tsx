'use client';

import React, { useState } from "react";
import { FaRunning } from "react-icons/fa";

const FEATURE_CARDS = [
  {
    id: '1',
    description: "I want to find out ingredients in my food are healthy or not",
  },
  {
    id: '2',
    description: "I am suffering from a health condition and want to know what I should eat",
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
    description: "I want to learn how I can cook healthier meals",
  },
  {
    id: '6',
    description: "I want to know about a particular food item",
  },
  {
    id: '7',
    description: "Give me a random food fact",
  },
];

type FeatureCard = {
  id: string;
  description: string;
}

const Dashboard = () => {
  const [selectedCard, setSelectedCard] = useState<FeatureCard>();

  const handleCardSelection = (card: FeatureCard) => {
    setSelectedCard(card);
  }

  return (
    <div className="flex p-8 gap-4 h-screen bg-app-dark">
      <div className="flex flex-col items-center w-2/3 gap-36 mx-auto">
        <div className="flex flex-col items-center gap-16">
          <h1 className="flex gap-3 text-star-white cursor-pointer text-5xl font-secondary">
            Better <span className="text-app-primary flex gap-2 items-center">Health <FaRunning size={48} /></span>
          </h1>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {
              FEATURE_CARDS.map((card) => (
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
        {
          selectedCard && (
            <div
              className={`flex max-w-96 min-h-24 items-center gap-3 text-[#F2F4F6] cursor-pointer p-5 rounded-lg border-4 border-[#2B2D31] hover:border-[#404249]`}
            >
              <p className="text-center text-base">{selectedCard.description}</p>
            </div>
          )
        }
        {/* <div className="flex flex-col items-center justify-center w-24 h-12 bg-[#28b463] hover:shadow-sm hover:bg-[#28b463]/90 cursor-pointer rounded-md text-[#18392A] text-base uppercase font-bold">
          Submit
        </div> */}
      </div>
    </div>
  )
};

export default Dashboard;
