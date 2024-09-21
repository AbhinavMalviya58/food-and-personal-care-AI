'use client';

import React from "react";
import { FaRunning } from "react-icons/fa";
import { ModeToggle } from "@/components/toogle";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/constants";

const FEATURE_CARDS = [
  {
    description: "Food AI",
    id: '1',
    route: ROUTES.FOOD_AI,
  },
  {
    description: "Personal Care AI",
    id: '2',
    route: ROUTES.PERSONAL_CARE_AI,
  },
  {
    description: "Chats",
    id: '3',
    route: ROUTES.CHATS,
  },
  {
    description: "User Settings",
    id: '4',
    route: ROUTES.USER_SETTINGS,
  },
];

type FeatureCard = {
  description: string;
  id: string;
  route: string;
}

const Dashboard = () => {
  const router = useRouter();

  const handleCardSelection = (card: FeatureCard) => {
    router.push(`${card.route}`);
  }

  return (
    <div className="flex p-8 gap-4 h-screen bg-app-dark">
      <div className="flex flex-col items-center w-2/3 gap-36 mx-auto">
        <div className="w-full flex flex-1 flex-col items-center gap-16">
          <h1 className="flex gap-3 text-star-white cursor-pointer text-5xl font-secondary">
            Better <span className="text-app-primary flex gap-2 items-center">
              Health <FaRunning size={48} />
            </span>
            <ModeToggle />
          </h1>

          <div className="w-2/3 grid grid-cols-2 gap-6 items-center justify-center">
            {
              FEATURE_CARDS.map((card) => (
                <div
                  key={card.id}
                  className={`flex min-h-24 items-center justify-center text-star-white cursor-pointer p-5 rounded-lg border-4 border-app-primary`}
                  onClick={() => handleCardSelection(card)}
                >
                  <p className="text-center text-base">{card.description}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
};

export default Dashboard;
