'use client';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import InputMessage from '../components/InputMessage';
import MessageContainer, { Message } from '../components/MessageContainer';
import { Login } from '../components/Login';

let socket: Socket;

export type User = {
  name: string;
  socketId: string;
  email: string;
};

export default function Home() {
  const [userLogged, setUserLogged] = useState<User | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    socket = io('http://localhost:3003');

    socket.on('login-success', (user: User) => {
      setUserLogged(user);
    });

    socket.on('receive-message', (message) => {
      setMessages((old) => old.concat(message));
    });

    socket.on('all-messages', (allMessages) => {
      setMessages(allMessages);
    });
  };

  const handleSend = (message: string) => {
    if (message.trim().length > 0 && userLogged) {
      setMessages((old) => old.concat({ user: userLogged, text: message }));
      socket.emit('new-message', { message, userEmail: userLogged.email });
    }
  };

  const handleLoginSend = (user: any) => {
    socket.emit('login', user);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!userLogged ? (
        <div className="w-full h-full max-w-md">
          <Login onLoginSend={handleLoginSend} />
        </div>
      ) : (
        <div className="w-full max-w-xl">
          <MessageContainer me={userLogged} messages={messages} />
          <InputMessage onSend={handleSend} />
        </div>
      )}
    </main>
  );
}
