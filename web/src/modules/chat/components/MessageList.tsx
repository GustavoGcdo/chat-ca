import { useEffect, useRef } from 'react';
import { Message } from '../../@shared/store/slices/message.slice';
import { useMessageStore, useRealtimeStore, useUserStore } from '../../@shared/store/store';
import MessageItem from './MessageItem';

const MessageList = () => {
  const messages = useMessageStore((state) => state.messages);
  const { userLogged, activeFriend } = useUserStore();
  const { addMessage, setInitialMessages } = useMessageStore();
  const { socket } = useRealtimeStore();
  const containerScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketInitializer();

    containerScrollRef.current?.lastElementChild?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'end',
    });

    const unsubscribe = useMessageStore.subscribe(() => {
      setTimeout(() => {
        containerScrollRef.current?.lastElementChild?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'end',
        });
      }, 10); // todo: verificar porque é executado antes da renderização
    });

    return () => {
      unsubscribe();

      socket?.off('private-messages');
      socket?.off('receive-message');
    };
  }, []);

  const socketInitializer = async () => {
    if (!socket) return;

    socket.on('private-messages', (messages) => {
      setInitialMessages(messages);
    });

    socket.on('receive-message', (message: Message) => {

      const meSendingMessage =
        message.sender.email == userLogged?.email && message.receiver.email == activeFriend?.email;

      const myActiveFriendSendingMessage =
        message.receiver.email == userLogged?.email && message.sender.email == activeFriend?.email;

      if (meSendingMessage || myActiveFriendSendingMessage) {
        addMessage(message);
      }
    });
  };

  return (
    <div className="p-2 my-2 rounded h-full min-h-[400px] max-h-[400px] bg-white overflow-auto">
      <div className="flex flex-col gap-2 pb-2" ref={containerScrollRef}>
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
        <div className="w-full h-[10px]"></div>
      </div>
    </div>
  );
};

export default MessageList;