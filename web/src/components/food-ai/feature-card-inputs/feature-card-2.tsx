import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FeatureCard2 = () => {
  const [condition, setCondition] = useState("Diabetes");
  const [ingredients, setIngredients] = useState("");

  const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCondition(e.target.value);
  };

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngredients(e.target.value);
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    console.log("Image upload functionality not yet implemented");
  };

  const handleSubmit = () => {
    // TODO: Implement submit functionality
    console.log("Submit functionality not yet implemented");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span>I am suffering from</span>
        <Input
          className="flex-1"
          placeholder="e.g. diabetes, high blood pressure, etc."
          type="text"
          value={condition}
          onChange={handleConditionChange}
        />
      </div>
      <div className="flex gap-4 items-center">
        <Button
          onClick={handleImageUpload}
          variant="app-primary"
        >
          Upload Image
        </Button>
        <Input
          className="flex-1"
          placeholder="e.g. apple, banana, etc."
          type="text"
          value={ingredients}
          onChange={handleIngredientsChange}
        />
        <Button
          onClick={handleSubmit}
          variant="app-primary"
        >
          Submit
        </Button>
      </div>
      <div>
        <h1 className="text-star-white text-base">
          Upload an image of the ingredients list on the packaging of the food item or write down about the ingredients included in the food item.
        </h1>
      </div>
    </div>
  );
};

export default FeatureCard2;
