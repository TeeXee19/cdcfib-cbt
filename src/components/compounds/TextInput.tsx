import { TextInputProps } from "../../types/input.type";
import Input from "../atoms/Input";



const TextInput = ({
  label,
  type,
  name,
  value,
  change,
  placeholder = "Enter Value",
}: TextInputProps) => {
  return (
    <>
      <div className="pt-4">
        <label
          htmlFor={label}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <Input
          name={name}
          value={type === "file" ? undefined : value}
          type={type}
          placeholder={placeholder}
          onChange={change}
        />
      </div>
    </>
  );
};

export default TextInput;
