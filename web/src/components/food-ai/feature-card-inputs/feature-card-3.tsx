import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

const FeatureCard3 = () => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 items-center justify-center">
        <h1 className="text-star-white text-base">
          Click on the button to proceed to the diet plan creation page
        </h1>
        <Button
          onClick={() => router.push("/diet-plan")}
          variant="app-primary"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default FeatureCard3;
