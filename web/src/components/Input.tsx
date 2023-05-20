import React, { InputHTMLAttributes } from 'react';

type Props = {
  name: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ name, label, ...rest }: Props) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        {...rest}
        name={name}
        className="p-2 rounded w-full"                
      />
    </div>
  );
};

export default Input;
