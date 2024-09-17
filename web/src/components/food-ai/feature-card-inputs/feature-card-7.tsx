import { Button } from "@/components/ui/button"
import { useState } from "react"

const FeatureCard7 = () => {
  const [foodFact, setFoodFact] = useState<string | null>(null)

  const handleGetFoodFact = () => {
    // TODO: Implement API call to get a random food fact
    const dummyFact = "Bananas are berries, but strawberries aren't."
    setFoodFact(dummyFact)
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 items-center justify-center">
        <h1 className="text-star-white text-base">
          Click on the button to get a random food fact.
        </h1>
        <Button
          onClick={handleGetFoodFact}
          variant="app-primary"
        >
          Get Fact
        </Button>
      </div>
      {foodFact && (
        <div className="text-star-white text-base mt-4">
          <strong>Food Fact:</strong> {foodFact}
        </div>
      )}
    </div>
  );
};

export default FeatureCard7;
