import React from 'react';
import { User } from '../app/page';

export type Message = {
  user: User;
  text: string;
};

type Props = {
  me?: any;
  messages: Message[];
};

const MessageContainer = ({ messages, me }: Props) => {
  const isMyMessage = (message: Message) => {
    return me.email == message.user.email;
  };

  return (
    <div className="p-2 my-2 rounded h-full min-h-[400px] bg-white overflow-auto">
      <div className="flex flex-col gap-2">
        {messages.map((message, index) => (
          <span
            className={`px-3 flex flex-col py-1 rounded ${
              isMyMessage(message) ? 'self-end text-end bg-gray-200' : 'self-start bg-blue-200'
            }`}
            key={index}
          >
            <span>{message.text}</span>
            <span className="text-xs text-gray-500">{message.user.email}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MessageContainer;
