import Select, { SelectProps } from "../atoms/Select";



interface SelectFiledProps extends SelectProps {
    label: string;
  }
const SelectField = ({label, name, options, onChange:change }:SelectFiledProps)=>{
    return (
        <>
        <div className="pt-4">
        <label
          htmlFor={label}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <Select
          name={name}
          options={options}
          onChange={change}
        />
      </div>
        </>
    )
}

export default SelectField;