import format from 'date-fns/format';
import React from 'react';
import { useUserStore } from '../store/store';
import { Message } from '../store/slices/message.slice';

type Props = {
  message: Message;
};

const MessageItem = ({ message }: Props) => {
  const { userLogged } = useUserStore();

  const isMyMessage = () => {
    return userLogged?.email == message.sender.email;
  };

  const getTimeMessage = () => {
    return format(new Date(message.date), 'HH:mm');
  };
  return (
    <div
      className={`px-2 pb-3 flex flex-col py-1 rounded relative ${
        isMyMessage() ? 'self-end text-end bg-gray-200 pl-10' : 'self-start bg-blue-200 pr-10'
      }`}
    >
      <span className="text-xs text-gray-500 font-bold">{message.sender.name}</span>
      <span className="block leading-4">{message.text}</span>
      <span
        className={`text-xs text-gray-500 absolute bottom-0 ${
          isMyMessage() ? 'left-1' : 'right-1'
        }`}
      >
        {getTimeMessage()}
      </span>
    </div>
  );
};

export default MessageItem;
