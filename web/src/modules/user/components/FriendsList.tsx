import { useEffect } from 'react';
import { User } from '../../@shared/store/slices/user.slice';
import { useRealtimeStore, useUserStore } from '../../@shared/store/store';
import Friend from './Friend';

const FriendsList = () => {
  const { friends, userLogged, addFriend, addFriendList } = useUserStore();
  const { socket } = useRealtimeStore();

  useEffect(() => {
    socketInitializer();

    return () => {
      socket?.off('all-friends');
      socket?.off('new-friend');
    };
  }, []);

  const socketInitializer = async () => {
    if (!socket) return;

    socket.emit('get-friends', { userEmail: userLogged?.email });

    socket.on('new-friend', (friend) => {
      addFriend(friend);
    });

    socket.on('all-friends', (friends) => {
      addFriendList(friends);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {friends.map((friend: User) => (
        <Friend key={friend.socketId} friend={friend} />
      ))}

      {friends.length == 0 && <div className='text-sm'>Nenhum amigo adicionado</div>}
    </div>
  );
};

export default FriendsList;
