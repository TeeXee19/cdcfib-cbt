import { useState } from "react";
import { TextInputProps } from "../../types/input.type";
import Input from "../atoms/Input";

const Password = ({ name, label, value, change }: TextInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return (
    <>
      {/* <div> */}
      <div className="pt-4">
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <div className="flex rounded-lg shadow-sm">
          {/* <input type="text" id="hs-trailing-button-add-on-with-icon" name="hs-trailing-button-add-on-with-icon" class="py-3 px-4 block w-full border-gray-200 shadow-sm rounded-s-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"> */}
          <Input
            value={value}
            name={name}
            placeholder="*********"
            type={showPassword ? "text" : "password"}
            onChange={change}
          />
          <button
            onClick={togglePasswordVisibility}
            type="button"
            className="w-[2.875rem] h-[2.875rem] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-e-md border border-transparent bg-black text-white hover:bg-blue-700 focus:outline-none focus:bg-black disabled:opacity-50 disabled:pointer-events-none"
          >
            {showPassword && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5C7.305 4.5 3.24 7.602 1.5 12c1.74 4.398 5.805 7.5 10.5 7.5s8.76-3.102 10.5-7.5C20.76 7.602 16.695 4.5 12 4.5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                />
              </svg>
            )}
            {!showPassword && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.75 10.75a2.25 2.25 0 003.5 3.5M9.603 6.98A6.735 6.735 0 0112 6.75c4.695 0 8.76 3.102 10.5 7.5a11.058 11.058 0 01-4.235 4.654M4.235 15.654A11.058 11.058 0 011.5 12c1.021-2.585 2.97-4.82 5.397-6.02"
                />
              </svg>
            )}
          </button>
        </div>
        {/* <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required /> */}
      </div>
      {/* </div> */}
    </>
  );
};

export default Password;
