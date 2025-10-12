import { TextInputProps } from "../../types/input.type";

const TextAreaField = ({
  label, 
  name, 
  value, 
  placeholder, 
  change
}:TextInputProps) => {
  return (
    <div>
      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <textarea
        id="message"
        name={name}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        onChange={change}
        value={value}
      ></textarea>
    </div>
  );
};

export default TextAreaField;
