import { SyntheticEvent, useState } from 'react';
import { useRealtimeStore, useUserStore } from '../../@shared/store/store';

const InputMessage = () => {
  const [value, setValue] = useState('');
  const { userLogged, activeFriend } = useUserStore();
  const { socket } = useRealtimeStore();

  const handleSend = (event: SyntheticEvent<any>) => {
    event.preventDefault();

    if (value.trim().length > 0 && userLogged && socket && activeFriend) {
      socket.emit('new-message', {
        message: value,
        userEmail: userLogged.email,
        receiverEmail: activeFriend.email,
      });
      setValue('');
    }
  };

  return (
    <form className="flex bg-stone-200 p-4" onSubmit={handleSend}>
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
