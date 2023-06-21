import { useEffect } from 'react';
import { useRealtimeStore, useUserStore } from '../../@shared/store/store';
import { FriendshipRequest } from '../../@shared/store/slices/user.slice';

const FriendshipRequestList = () => {
  const {
    friendshipRequests,
    userLogged,
    addFriendshipRequestList,
    addFriendshipRequest,
    removeFriendshipRequest,
  } = useUserStore();
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

    socket.on('new-friendship-request', (friendship) => {
      addFriendshipRequest(friendship);
    });

    socket.on('all-active-friendship-requests', (friendshipRequests) => {
      addFriendshipRequestList(friendshipRequests);
    });
  };

  const handleReplyRequest = (friendshipRequest: FriendshipRequest) => {
    if (!socket) return;

    socket.emit('reply-friendship-request', {
      userEmail: friendshipRequest.receiver.email,
      friendEmail: friendshipRequest.requester.email,
      confirm: true,
    });

    removeFriendshipRequest(friendshipRequest);
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
            <span
              className="px-2 py-1 cursor-pointer hover:border-green-400 border-transparent border-2 transition-all text-green-400 rounded"
              onClick={() => handleReplyRequest(friendshipRequest)}
            >
              Aceitar
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendshipRequestList;
