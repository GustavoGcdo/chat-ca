'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AddFriend from '../../components/AddFriend';
import FriendsList from '../../components/FriendsList';
import InputMessage from '../../components/InputMessage';
import MessageList from '../../components/MessageList';
import { useUserStore } from '../../store/store';

export default function ChatPage() {
  const { userLogged, activeFriend } = useUserStore();  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = useUserStore.subscribe((state) => {
      if (state.userLogged == undefined) {
        router.replace('/');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex gap-10 w-full justify-center">
      <div className="w-full max-w-md pb-10">
        <h3 className="text-center font-medium py-4 text-xl">
          Bem vindo
          <strong className="ml-2 font-bold">{userLogged?.email}</strong>!
        </h3>
        <h3 className="text-start font-medium py-4 text-xl">Amigos</h3>

        <AddFriend />
        <FriendsList />
      </div>

      {activeFriend && (
        <div className="w-full max-w-xl">
          <MessageList />
          <InputMessage />
        </div>
      )}
    </div>
  );
}
