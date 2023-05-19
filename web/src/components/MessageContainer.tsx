import { Message } from '../store/slices/message.slice';
import { useAppStore } from '../store/store';


const MessageContainer = () => {
  const { userLogged, messages } = useAppStore();

  const isMyMessage = (message: Message) => {
    return userLogged?.email == message.user.email;
  };

  return (
    <div className="p-2 my-2 rounded h-full min-h-[400px] max-h-[400px] bg-white overflow-auto">
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
