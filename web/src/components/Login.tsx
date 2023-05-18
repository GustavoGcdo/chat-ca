import React, { SyntheticEvent, useState } from 'react';

type Props = {
  onLoginSend: (user: any) => void;
};

export const Login = ({ onLoginSend }: Props) => {
  const [user, setUser] = useState({
    email: '',
    name: '',
  });

  const onSubmit = (event: SyntheticEvent<any>) => {
    event.preventDefault();

    onLoginSend(user);
  };

  return (
    <div>
      <h3 className="text-center font-medium py-4 text-xl">Chat CA</h3>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="name">Nome</label>
            <input
              name="name"
              className="p-2 rounded w-full"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              type="text"
              placeholder="Informe seu nome"
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              name="email"
              className="p-2 rounded w-full"
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
  );
};
