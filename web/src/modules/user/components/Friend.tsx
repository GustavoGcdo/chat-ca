import React from 'react';
import { User } from '../../@shared/store/slices/user.slice';
import { useRealtimeStore, useUserStore } from '../../@shared/store/store';

type Props = {
  friend: User;
};

const Friend = ({ friend }: Props) => {
  const { userLogged, activeFriend, setActiveFriend } = useUserStore();
  const { socket } = useRealtimeStore();

  const handleActiveFriend = (friend: User) => {
    if (!socket || !userLogged) return;

    setActiveFriend(friend);

    socket.emit('get-private-messages', {
      userEmail: userLogged.email,
      friendEmail: friend.email,
    });
  };

  return (
    <div
      className={`p-2 bg-gray-300 border-2 rounded ${
        activeFriend?.email == friend.email
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-gray-300 border-slate-400'
      }`}
      key={friend.socketId}
      onClick={() => handleActiveFriend(friend)}
    >
      {friend.name}
    </div>
  );
};

export default Friend;
