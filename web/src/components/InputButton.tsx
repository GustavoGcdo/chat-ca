import { InputHTMLAttributes, MouseEventHandler } from 'react';
import Input from './Input';

type Props = {
  name: string;
  buttonText: string;
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  inputProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'onClick'>;
};

const InputButton = ({ name, buttonText, onButtonClick, inputProps }: Props) => {
  return (
    <div className="flex">
      <Input name={name} {...inputProps} />
      <button className="bg-gray-800 px-4 text-white rounded-r" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default InputButton;
