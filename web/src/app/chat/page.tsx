'use client';

import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import InputButton from '../../components/InputButton';
import InputMessage from '../../components/InputMessage';
import MessageContainer from '../../components/MessageContainer';
import { User } from '../../store/slices/user.slice';
import { useMessageStore, useRealtimeStore, useUserStore } from '../../store/store';

export default function ChatPage() {
  const { userLogged } = useUserStore();
  const { addMessage } = useMessageStore();
  const { socket } = useRealtimeStore();
  const router = useRouter();

  const [friends, setFriends] = useState<User[]>([
    { email: 'alguem@gmail.com', name: 'alguem', socketId: 'asdfasdf654a' },
    { email: 'alguem@gmail.com', name: 'alguem', socketId: 'asdfasdfa3' },
    { email: 'alguem@gmail.com', name: 'alguem', socketId: 'asdfasdfa5' },
    { email: 'alguem@gmail.com', name: 'alguem', socketId: 'asdfasdfa6' },
    { email: 'alguem@gmail.com', name: 'alguem', socketId: 'asdfasdfa234' },
  ]);

  const [emailToAdd, setEmailToAdd] = useState('');

  if (userLogged == undefined) {
    router.replace('/');
  }

  useEffect(() => {
    socketInitializer();

    return () => {
      socket?.off('receive-message');
    };
  }, []);

  const socketInitializer = async () => {
    if (!socket) return;

    socket.on('receive-message', (message) => {
      addMessage(message);
    });
  };

  const handleAddFriend = (e: SyntheticEvent<any>) => {
    e.preventDefault();

    if (!userLogged || !socket) return;

    socket.emit('add-friendship', {
      userEmail: userLogged.email,
      userFriendEmail: emailToAdd,
    });
  };

  return (
    <div className="flex gap-10 w-full justify-center">
      <div className="w-full max-w-md pb-10">
        <h3 className="text-center font-medium py-4 text-xl">Amigos</h3>

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

        <div>
          <span className="block mb-3">Meus amigos</span>
          <div className="flex flex-col gap-2">
            {friends.map((friend) => (
              <div
                className="p-2 bg-gray-300 border-2 border-slate-400 rounded"
                key={friend.socketId}
              >
                {friend.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl">
        <MessageContainer />
        <InputMessage />
      </div>
    </div>
  );
}
