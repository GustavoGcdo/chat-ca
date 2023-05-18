import React from 'react';

export type Message = {
  userEmail: string;
  text: string;
};

type Props = {
  me?: any;
  messages: Message[];
};

const MessageContainer = ({ messages, me }: Props) => {
  
  const isMyMessage = (message: Message) => {
    return me.email == message.userEmail;
  };

  return (
    <div className="p-2 my-2 rounded h-full min-h-[400px] bg-white overflow-auto">
      <div className="flex flex-col gap-2">
        {messages.map((message, index) => (
          <span
            className={`px-3 py-1 rounded ${
              isMyMessage(message) ? 'self-end bg-gray-200' : 'self-start bg-blue-200'
            }`}
            key={index}
          >
            {message.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MessageContainer;
