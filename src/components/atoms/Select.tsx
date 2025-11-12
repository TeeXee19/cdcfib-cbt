/* eslint-disable @typescript-eslint/no-explicit-any */
// SearchableSelect.jsx
import { ChangeEvent } from 'react';
// import { Autocomplete, TextField } from '@mui/material';

export interface SelectProps{
    options:{value:any, label:any}[]
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void,
    name: string,
    className?: string | undefined,
    placeholder?: string | undefined,
}



const Select = ({
    name, 
    options, 
    onChange,
}:SelectProps) => {



  return (
   

  <select 
    id="countries"    
    name={name}
    // value={value}
    onChange={onChange}
    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    <option value=''>Select ...</option>
    {options?.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>


  );
};

export default Select;
