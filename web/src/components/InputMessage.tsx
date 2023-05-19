import { SyntheticEvent, useState } from 'react';
import { useAppStore } from '../store/store';

type Props = {
  onSend: (message: string) => void;
};

const InputMessage = ({ onSend }: Props) => {
  const [value, setValue] = useState('');
  const { userLogged, addMessage } = useAppStore();

  const handleSend = (event: SyntheticEvent<any>) => {
    event.preventDefault();
    
    if (value.trim().length > 0 && userLogged) {
      addMessage({ user: userLogged, text: value });
      setValue('');
      onSend(value);
    }
  };

  return (
    <form className="flex pl-3 bg-white rounded" onSubmit={handleSend}>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="py-2 bg-transparent w-full focus:outline-none"
        type="text"
        placeholder="Escreva sua mensagem aqui"
      />
      <button className="bg-gray-800 px-4 text-white rounded-r" onClick={handleSend}>
        Enviar
      </button>
    </form>
  );
};

export default InputMessage;
