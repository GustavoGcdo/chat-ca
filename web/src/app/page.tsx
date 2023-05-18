'use client';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import InputMessage from '../components/InputMessage';
import MessageContainer, { Message } from '../components/MessageContainer';

let socket: Socket;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    socket = io('http://localhost:3000');
    socket.on('receive-message', (message) => {
      console.log(message);
      
      setMessages((old) => old.concat(message));
    });
  };

  const handleSend = (message: string) => {
    if (message.trim().length > 0) {
      setMessages((old) => old.concat({ sender: socket.id, text: message }));
      socket.emit('new-message', { message });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-xl">
        <MessageContainer me={socket?.id} messages={messages} />
        <InputMessage onSend={handleSend} />
      </div>
    </main>
  );
}
