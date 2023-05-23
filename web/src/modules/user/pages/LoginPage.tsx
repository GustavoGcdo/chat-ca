import { User } from '@/modules/@shared/store/slices/user.slice';
import { useRealtimeStore, useUserStore } from '@/modules/@shared/store/store';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import Input from '@/modules/@shared/components/Input';

export const LoginPage = () => {
  const { login } = useUserStore();
  const { socket } = useRealtimeStore();
  const router = useRouter();

  const [user, setUser] = useState({
    email: '',
    name: '',
  });

  const onSubmit = (event: SyntheticEvent<any>) => {
    event.preventDefault();
    if (socket) socket.emit('login', user);
  };

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

  return (
    <div className="w-full h-full max-w-md">
      <div>
        <h3 className="text-center font-medium py-4 text-xl">Chat CA</h3>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="name">Nome</label>
              <Input
                name="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                type="text"
                placeholder="Informe seu nome"
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <Input
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                type="email"
                placeholder="Informe seu email"
              />
            </div>
            <button className="bg-gray-800 px-4 text-white rounded p-2 mt-4">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
