import { BlinkBlur } from "react-loading-indicators";
interface ButtonProps {
  type: "button" | "submit";
  label: string;
  color?: string;
  bgColor?: string;
  onclick: () => void;
  width?: string;
  border?: string;
  hasImage?: boolean;
  image?: string;
  disabled?: boolean;
}
const Button = ({
  type,
  label,
  bgColor = "bg-black",
  color = "bg-white",
  width,
  border,
  hasImage = false,
  image,
  onclick,
  disabled = false,
}: ButtonProps) => {
  return (
    <>
      <button
        disabled={disabled}
        onClick={onclick}
        type={type}
        className={`${bgColor} ${color} ${border} ${width} font-[Open Sans] hover:bg-[#004E40]/50 font-bold font-[400] text-[24px]  hover:text-white py-2 px-4 border  hover:border-transparent rounded-lg`}
      >
        <div className="flex justify-center">
          {disabled ? (
            <BlinkBlur color={color} size="small" text="" textColor="" />
          ) : (
            <>
              {label}{" "}
              {hasImage && <img className="ml-4" src={image} alt="image" />}
            </>
          )}
        </div>
      </button>
    </>
  );
};

export default Button;
