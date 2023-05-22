'use client';

import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import InputButton from '../../components/InputButton';
import InputMessage from '../../components/InputMessage';
import MessageContainer from '../../components/MessageContainer';
import { User } from '../../store/slices/user.slice';
import { useMessageStore, useRealtimeStore, useUserStore } from '../../store/store';
import { Message } from '../../store/slices/message.slice';

export default function ChatPage() {
  const { userLogged, friends, addFriendList, addFriend, setActiveFriend, activeFriend } =
    useUserStore();
  const { addMessage, setInitialMessages } = useMessageStore();
  const { socket } = useRealtimeStore();
  const router = useRouter();

  const [emailToAdd, setEmailToAdd] = useState('');

  useEffect(() => {
    socketInitializer();

    const unsubscribe = useUserStore.subscribe((state) => {
      if (!socket) return;

      if (state.userLogged == undefined) {
        router.replace('/');
      }

      socket.off('receive-message');

      socket.on('receive-message', (message: Message) => {
        const meSendingMessage =
          message.sender.email == userLogged?.email &&
          message.receiver.email == state.activeFriend?.email;

        const myActiveFriendSendingMessage =
          message.receiver.email == userLogged?.email &&
          message.sender.email == state.activeFriend?.email;

        if (meSendingMessage || myActiveFriendSendingMessage) {
          addMessage(message);
        }
      });
    });

    return () => {
      unsubscribe();

      socket?.off('receive-message');
      socket?.off('all-friends');
      socket?.off('new-friend');
    };
  }, []);

  const socketInitializer = async () => {
    if (!socket) return;

    socket.emit('get-friends', { userEmail: userLogged?.email });

    socket.on('new-friend', (friend) => {
      addFriend(friend);
    });

    socket.on('all-friends', (friends) => {
      addFriendList(friends);
    });

    socket.on('private-messages', (messages) => {
      setInitialMessages(messages);
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

  const handleActiveFriend = (friend: User) => {
    if (!socket || !userLogged) return;

    setActiveFriend(friend);

    socket.emit('get-private-messages', {
      userEmail: userLogged.email,
      friendEmail: friend.email,
    });
  };

  return (
    <div className="flex gap-10 w-full justify-center">
      <div className="w-full max-w-md pb-10">
        <h3 className="text-center font-medium py-4 text-xl">
          Bem vindo
          <strong className="ml-2 font-bold">{userLogged?.email}</strong>!
        </h3>
        <h3 className="text-start font-medium py-4 text-xl">Amigos</h3>

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
            {friends.map((friend: User) => (
              <div
                className={`p-2 bg-gray-300 border-2 rounded ${
                  activeFriend?.email == friend.email
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-gray-300 border-slate-400'
                }`}
                key={friend.socketId}
                onClick={() => handleActiveFriend(friend)}
              >
                {friend.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeFriend && (
        <div className="w-full max-w-xl">
          <MessageContainer />
          <InputMessage />
        </div>
      )}
    </div>
  );
}
