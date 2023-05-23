import InputMessage from '@/modules/chat/components/InputMessage';
import MessageList from '@/modules/chat/components/MessageList';
import AddFriend from '@/modules/user/components/AddFriend';
import FriendsList from '@/modules/user/components/FriendsList';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMessageStore, useRealtimeStore, useUserStore } from '../../@shared/store/store';
import { Message } from '../../@shared/store/slices/message.slice';

const MainChatPage = () => {
  const { userLogged, activeFriend } = useUserStore();
  const { addMessage, addFriendWithNewMessages } = useMessageStore();
  const { socket } = useRealtimeStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = useUserStore.subscribe((state) => {
      if (state.userLogged == undefined) {
        router.replace('/');
      }

      if (!socket) return;

      socket.off('receive-message');

      socket.on('receive-message', (message: Message) => {
        const meSendingMessage =
          message.sender.email == state.userLogged?.email &&
          message.receiver.email == state.activeFriend?.email;

        const myActiveFriendSendingMessage =
          message.receiver.email == state.userLogged?.email &&
          message.sender.email == state.activeFriend?.email;

        if (meSendingMessage || myActiveFriendSendingMessage) {
          console.log('adiciona');

          addMessage(message);
        } else {
          console.log('não adiciona');
          addFriendWithNewMessages(message.sender);
        }
      });
    });

    return () => {
      unsubscribe();
      socket?.off('receive-message');
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
