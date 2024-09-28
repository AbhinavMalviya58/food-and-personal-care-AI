import { FeatureCard1 } from "@/components/personal-care-ai/feature-card-inputs";

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
  };

  return (
    <div></div>
  );
};

export default InputRender;
