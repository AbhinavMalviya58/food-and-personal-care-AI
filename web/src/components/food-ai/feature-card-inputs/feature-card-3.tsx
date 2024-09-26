import { Button } from "@/components/ui/button"

const FeatureCard3 = () => {
  const handleClick = () => {
    // Add your logic here for proceeding to the diet plan creation page
    console.log("Button clicked, proceeding to diet plan creation page...");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 items-center justify-center">
        <h1 className="text-star-white text-base">
          Click on the button to proceed to the diet plan creation page
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

export default FeatureCard3;
