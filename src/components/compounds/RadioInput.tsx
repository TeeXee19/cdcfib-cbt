import { TextInputProps } from "../../types/input.type";

interface RadioInputProps extends TextInputProps{
    checked: boolean
}
const RadioInput = ({
  label,
  name,
  value,
  change,
  checked=false
}: RadioInputProps) => {
  return (
    <>
      <div className="inline-flex items-center">
        <label className="relative flex items-center cursor-pointer" htmlFor="html">
        <input name={name} checked={checked} onChange={change} value={value} id={value} type="radio" className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all" />
          <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
        </label>
        <label
          className="ml-2 text-slate-600 cursor-pointer text-sm"
          htmlFor="html"
        >
          {label}
        </label>
      </div>
    </>
  );
};

export default RadioInput;
