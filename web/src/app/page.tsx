'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Login } from '../components/Login';
import { User } from '../store/slices/user.slice';
import { useMessageStore, useRealtimeStore, useUserStore } from '../store/store';

export default function Home() {
  const { login } = useUserStore();
  const { setInitialMessages } = useMessageStore();
  const { socket } = useRealtimeStore();
  const router = useRouter();

  useEffect(() => {
    socketInitializer();

    return () => {
      socket?.off('login-success');      
    };
  }, []);

  const socketInitializer = async () => {
    if (!socket) return;

    socket.on('login-success', (user: User) => {
      login(user);
      router.push('/chat');
    });
  };

  const handleLoginSend = (user: any) => {
    if (socket) socket.emit('login', user);
  };

  return (
    <div className="w-full h-full max-w-md">
      <Login onLoginSend={handleLoginSend} />
    </div>
  );
}
