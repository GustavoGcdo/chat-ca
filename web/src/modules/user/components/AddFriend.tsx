import React, { SyntheticEvent, useState } from 'react';
import InputButton from '../../@shared/components/InputButton';
import { useRealtimeStore, useUserStore } from '../../@shared/store/store';

const AddFriend = () => {
  const { userLogged } = useUserStore();
  const { socket } = useRealtimeStore();
  const [emailToAdd, setEmailToAdd] = useState('');

  const handleAddFriend = (e: SyntheticEvent<any>) => {
    e.preventDefault();

    if (!userLogged || !socket) return;

    socket.emit('request-friendship', {
      userEmail: userLogged.email,
      friendEmail: emailToAdd,
    });
  };

  return (
    <form className="mb-5" onSubmit={handleAddFriend}>
      <InputButton
        name="email"
        buttonText="adicionar"
        inputProps={{
          placeholder: 'Informe o email do seu amigo',
          value: emailToAdd,
          onChange: (e) => setEmailToAdd(e.target.value),
        }}
      />
    </form>
  );
};

export default AddFriend;
