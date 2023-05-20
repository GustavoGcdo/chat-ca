'use client';
import { useEffect } from 'react';
import InputMessage from '../components/InputMessage';
import { Login } from '../components/Login';
import MessageContainer from '../components/MessageContainer';
import { User } from '../store/slices/user.slice';
import { useMessageStore, useRealtimeStore, useUserStore } from '../store/store';

export default function Home() {
  const { userLogged, logout, login } = useUserStore();
  const { setInitialMessages, addMessage } = useMessageStore();
  const { socket, isOnline } = useRealtimeStore();

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    if (!socket) return;

    socket.on('login-success', (user: User) => {
      login(user);
    });

    socket.on('receive-message', (message) => {
      addMessage(message);
    });

    socket.on('all-messages', (allMessages) => {
      setInitialMessages(allMessages);
    });
  };

  const handleLoginSend = (user: any) => {
    console.log('opa', socket)
    
    if (socket) socket.emit('login', user);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!userLogged ? (
        <div className="w-full h-full max-w-md">
          <Login onLoginSend={handleLoginSend} />
        </div>
      ) : (
        <div className="w-full max-w-xl">
          <MessageContainer />
          <InputMessage />
        </div>
      )}
      <span className="mt-5 px-2 rounded text-white bg-gray-500"> {typeof window !== 'undefined' && isOnline ? 'Online' : 'Offline'}</span>
    </main>
  );
}
