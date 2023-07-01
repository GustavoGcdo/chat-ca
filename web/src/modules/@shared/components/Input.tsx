import React, { InputHTMLAttributes } from 'react';

type Props = {
  name: string;
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ name, label, ...rest }: Props) => {
  return (
    <div className='w-full'>
      {label && <label htmlFor={name}>{label}</label>}
      <input {...rest} name={name} className="p-2 rounded-l w-full text-gray-700 focus:outline-none" />      
    </div>
  );
};

export default Input;
