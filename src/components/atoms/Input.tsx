

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface InputProps {
  type?: string;
  value?: string;
  name?:string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}
const Input = ({
  type = "text",
  value = "",
  name = "",
  onChange,
  placeholder = "Enter a Value",
}: InputProps) => {
  return (
    <>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </>
  );
};

export default Input;
