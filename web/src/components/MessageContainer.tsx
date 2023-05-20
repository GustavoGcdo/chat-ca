import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { Message } from '../store/slices/message.slice';
import { useMessageStore, useUserStore } from '../store/store';

const MessageContainer = () => {
  const { userLogged } = useUserStore();
  const messages = useMessageStore((state) => state.messages);
  const containerScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = useMessageStore.subscribe(() => {
      console.log(messages);
      
      containerScrollRef.current?.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'end',
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isMyMessage = (message: Message) => {
    return userLogged?.email == message.user.email;
  };

  const getTimeMessage = (message: Message) => {
    return format(new Date(message.date), 'HH:mm');
  };

  return (
    <div className="p-2 my-2 rounded h-full min-h-[400px] max-h-[400px] bg-white overflow-auto">
      <div className="flex flex-col gap-2 pb-10" ref={containerScrollRef}>
        {messages.map((message, index) => (
          <div
            className={`px-2 pb-3 flex flex-col py-1 rounded relative ${
              isMyMessage(message)
                ? 'self-end text-end bg-gray-200 pl-10'
                : 'self-start bg-blue-200 pr-10'
            }`}
            key={index}
          >
            <span className="text-xs text-gray-500 font-bold">{message.user.name}</span>
            <span className="block leading-4">{message.text}</span>
            <span
              className={`text-xs text-gray-500 absolute bottom-0 ${
                isMyMessage(message) ? 'left-1' : 'right-1'
              }`}
            >
              {getTimeMessage(message)}
            </span>
          </div>
        ))}
        <div className="w-full h-[10px]"></div>
      </div>
    </div>
  );
};

export default MessageContainer;
