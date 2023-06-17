import { useEffect } from 'react';
import { useRealtimeStore, useUserStore } from '../../@shared/store/store';

const FriendshipRequestList = () => {
  const { friendshipRequests, userLogged, addFriendshipRequestList } = useUserStore();
  const { socket } = useRealtimeStore();

  useEffect(() => {
    socketInitializer();

    return () => {
      socket?.off('all-active-friendship-requests');
    };
  }, []);

  const socketInitializer = async () => {
    if (!socket || !userLogged) return;

    socket.emit('get-all-active-friendship-requests', { userEmail: userLogged?.email });

    socket.on('all-active-friendship-requests', (friendshipRequests) => {
      console.log('opa', friendshipRequests);

      addFriendshipRequestList(friendshipRequests);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {friendshipRequests.map((friendshipRequest, index) => (
        <div key={index} className="flex items-center bg-slate-900 p-3 rounded text-white text-sm">
          <div className="flex flex-col flex-grow">
            <span>
              <strong>{friendshipRequest.requester.name}</strong>
            </span>
            <span>{friendshipRequest.requester.email}</span>
          </div>
          <div className="flex gap-1">
            <span className="px-2 py-1 cursor-pointer hover:border-red-500 border-transparent transition-all  border-2 text-red-500 rounded">
              Excluir
            </span>
            <span className="px-2 py-1 cursor-pointer hover:border-green-400 border-transparent border-2 transition-all text-green-400 rounded">
              Aceitar
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendshipRequestList;
