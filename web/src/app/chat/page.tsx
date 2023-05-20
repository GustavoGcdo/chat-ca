'use client';

import { useEffect } from 'react';
import InputMessage from '../../components/InputMessage';
import MessageContainer from '../../components/MessageContainer';
import { useUserStore, useMessageStore, useRealtimeStore } from '../../store/store';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const { userLogged } = useUserStore();
  const { addMessage } = useMessageStore();
  const { socket } = useRealtimeStore();
  const router = useRouter();

  if (userLogged == undefined) {
    router.replace('/');
  }

  useEffect(() => {
    socketInitializer();

    return () => {
      socket?.off('receive-message');
    };
  }, []);

  const socketInitializer = async () => {
    if (!socket) return;

    socket.on('receive-message', (message) => {
      addMessage(message);
    });
  };

  return (
    <div className="w-full max-w-xl">
      <MessageContainer />
      <InputMessage />
    </div>
  );
}
