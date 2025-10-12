import Input from "../atoms/Input";

interface EmailProps {
  label:string;
  value?: string;
  name?:string;
  emitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const Email = ({label, name, value, emitChange, placeholder}:EmailProps) => {
  return (
    <>
      {/* <div> */}
      <div className="py-4">
        <label
          htmlFor="first_name"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        {/* <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required /> */}
        <Input type="email" value={value} placeholder={placeholder} name={name} onChange={emitChange} />
      </div>
      {/* </div> */}
    </>
  );
};

export default Email;
