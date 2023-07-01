import InputMessage from '@/modules/chat/components/InputMessage';
import MessageList from '@/modules/chat/components/MessageList';
import AddFriend from '@/modules/user/components/AddFriend';
import FriendsList from '@/modules/user/components/FriendsList';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMessageStore, useRealtimeStore, useUserStore } from '../../@shared/store/store';
import { Message } from '../../@shared/store/slices/message.slice';
import FriendshipRequestList from '../../user/components/FriendshipRequestList';

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
          addMessage(message);
        } else {
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
    <div className="flex flex-1 w-full max-w-7xl justify-center">
      <div className="flex flex-col w-full max-w-sm py-4 grow bg-primary rounded-l-lg text-white">
        <div className="p-4 mb-5 flex flex-col justify-center">
          <h1 className="text-2xl uppercase font-light">
            CHAT <strong className="font-bold ml-[-7px]">CA</strong>
          </h1>
        </div>

        <div className="p-4">
          <h3 className="mb-3 font-semibold text-white/90 text-xs uppercase">
            Solicitação de amizade
          </h3>
          <FriendshipRequestList />
        </div>

        <div className="p-4">
          <h3 className="mb-3 font-semibold text-white/90 text-xs uppercase">Novo amigo</h3>
          <AddFriend />
        </div>

        <div className="p-4 grow">
          <span className="block mb-3 font-semibold text-white/90 text-xs uppercase">
            Meus amigos
          </span>
          <FriendsList />
        </div>

        <div className="p-4 flex flex-col justify-center">
          <h2 className="text-xl uppercase font-light">{userLogged?.name}</h2>
          <h3 className="font-semibold">{userLogged?.email}</h3>
        </div>
      </div>

      <div className="w-full flex flex-col rounded-r-lg bg-white">
        {activeFriend ? (
          <div className="flex flex-col h-full justify-center">
            <div className="p-4 leading-3 flex flex-col grow justify-center border-b-2 text-stone-700">
              <h2 className="font-semibold text-xl">{activeFriend?.name}</h2>
            </div>

            <MessageList />
            <InputMessage />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default MainChatPage;
