import { Button } from "@/components/ui/button"

const FeatureCard7 = () => {
  const handleClick = () => {
    // Add your logic here for getting a random food fact
    console.log("Button clicked, fetching random food fact...");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 items-center justify-center">
        <h1 className="text-star-white text-base">
          Click on the button to get a random food fact.
        </h1>
        <Button
          onClick={handleClick}
          variant="app-primary"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default FeatureCard7;
