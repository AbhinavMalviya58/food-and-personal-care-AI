import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FeatureCard2 = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <span>I am suffering from</span>
        <Input
          className="flex-1"
          placeholder="e.g. diabetes, high blood pressure, etc."
          type="text"
          value="Diabetes"
          onChange={() => { }}
        />
      </div>
      <div className="flex gap-4 items-center">
        <Button
          onClick={() => { }}
          variant="app-primary"
        >
          Upload Image
        </Button>
        <Input
          className="flex-1"
          placeholder="e.g. apple, banana, etc."
          type="text"
          value=""
          onChange={() => { }}
        />
        <Button
          onClick={() => { }}
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
