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
      className={`p-2 bg-white/20 border-2 text-white rounded relative cursor-pointer ${
        activeFriend?.email == friend.email
          ? 'border-white font-semibold'
          : 'border-transparent'
      }`}
      key={friend.socketId}
      onClick={() => handleActiveFriend(friend)}
    >
      <span className="block">{friend.name}</span>
      {hasNewMessages && (
        <span className="rounded-full bg-green-300 text-red-600 w-4 h-4 absolute right-2 my-auto top-0 bottom-0"></span>
      )}
    </div>
  );
};

export default Friend;
