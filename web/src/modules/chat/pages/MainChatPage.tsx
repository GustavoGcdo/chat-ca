import InputMessage from '@/modules/chat/components/InputMessage';
import MessageList from '@/modules/chat/components/MessageList';
import AddFriend from '@/modules/user/components/AddFriend';
import FriendsList from '@/modules/user/components/FriendsList';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserStore } from '../../@shared/store/store';

const MainChatPage = () => {
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
};

export default MainChatPage;
