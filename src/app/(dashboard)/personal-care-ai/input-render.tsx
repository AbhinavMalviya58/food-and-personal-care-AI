import { FeatureCard1, FeatureCard2 } from "@/components/personal-care-ai/feature-card-inputs";

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

  return (
    <div></div>
  );
};

export default InputRender;
