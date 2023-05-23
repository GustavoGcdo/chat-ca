import React, { useEffect, useState } from 'react';
import { User } from '../../@shared/store/slices/user.slice';
import { useMessageStore, useRealtimeStore, useUserStore } from '../../@shared/store/store';

type Props = {
  friend: User;
};

const Friend = ({ friend }: Props) => {
  const { userLogged, activeFriend, setActiveFriend } = useUserStore();
  const { removeFriendWithNewMessages } = useMessageStore();
  const { socket } = useRealtimeStore();
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const handleActiveFriend = (friend: User) => {
    if (!socket || !userLogged) return;

    setActiveFriend(friend);
    removeFriendWithNewMessages(friend);

    socket.emit('get-private-messages', {
      userEmail: userLogged.email,
      friendEmail: friend.email,
    });
  };

  useEffect(() => {
    const unsubscribe = useMessageStore.subscribe((state) => {
      const hasNewMessages = !!state.friendsWithNewMessages.find(
        (friendI) => friendI.email == friend.email,
      );

      setHasNewMessages(hasNewMessages);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className={`p-2 bg-gray-300 border-2 rounded relative ${
        activeFriend?.email == friend.email
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-gray-200 border-slate-400'
      }`}
      key={friend.socketId}
      onClick={() => handleActiveFriend(friend)}
    >
      <span className="block">{friend.name}</span>
      {hasNewMessages && (
        <span className="rounded-full bg-green-500 text-red-600 w-4 h-4 absolute right-2 my-auto top-0 bottom-0"></span>
      )}
    </div>
  );
};

export default Friend;
