import Button from "../atoms/Button";
import Icon from "@/assets/RDIcon.png";

const RequestDemo = () => {
  return (
    <Button
      type="button"
      label="Request a demo"
      bgColor="bg-black"
      color="text-white"
      hasImage={true}
      image={Icon}
      onclick={() => {}}
      width="w-[234px]"
    />
  );
};

export default RequestDemo;
