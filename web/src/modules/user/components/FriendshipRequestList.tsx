import { useEffect } from 'react';
import { useRealtimeStore, useUserStore } from '../../@shared/store/store';
import { FriendshipRequest } from '../../@shared/store/slices/user.slice';
import { Check, Trash } from 'lucide-react';

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
        <div
          key={index}
          className="flex items-center bg-white/30 border-white p-3 rounded text-white text-sm"
        >
          <div className="flex flex-col flex-grow">
            <span>
              <strong>{friendshipRequest.requester.name}</strong>
            </span>
            <span>{friendshipRequest.requester.email}</span>
          </div>
          <div className="flex gap-3 font-bold">
            <span className="p-2 cursor-pointer hover:bg-white text-white hover:text-red-500 rounded-full border-transparent transition-all  border-2 ">
              <Trash size={20} strokeWidth={2} />
            </span>
            <span
              className="p-2 cursor-pointer hover:bg-white text-white hover:text-green-400 rounded-full border-transparent border-2 transition-all "
              onClick={() => handleReplyRequest(friendshipRequest)}
            >
              <Check size={20} strokeWidth={2} />
            </span>
          </div>
        </div>
      ))}
      {friendshipRequests.length == 0 && <div className="text-sm">Nenhuma solicitação</div>}
    </div>
  );
};

export default FriendshipRequestList;
