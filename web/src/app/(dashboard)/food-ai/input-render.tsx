import { FeatureCard1, FeatureCard2, FeatureCard3, FeatureCard7 } from "@/components/food-ai/feature-card-inputs";

interface InputRenderProps {
  id: string;
}

const InputRender: React.FC<InputRenderProps> = ({
  id,
}) => {

  if (id === '1') {
    return (
      <FeatureCard1 />
    )
  }

  if (id === '2') {
    return (
      <FeatureCard2 />
    )
  }

  if (id === '3') {
    return (
      <FeatureCard3 />
    )
  }

  if (id === '7') {
    return (
      <FeatureCard7 />
    )
  }

  return (
    <div>

    </div>
  );
};

export default InputRender;
