import { StateCreator } from 'zustand';

export type User = {
  name: string;
  socketId: string;
  email: string;
};

export type FriendshipRequest = {
  requester: User;
  receiver: User;
  replied: boolean;
};

export interface UserSlice {
  userLogged: User | undefined;
  activeFriend: User | undefined;
  friendshipRequests: FriendshipRequest[];
  friends: User[];
  login: (user: User) => void;
  logout: () => void;
  addFriendList: (friends: User[]) => void;
  addFriend: (friend: User) => void;
  setActiveFriend: (friend: User) => void;
  addFriendshipRequestList: (friendshipRequests: FriendshipRequest[]) => void;
  addFriendshipRequest: (friendshipRequests: FriendshipRequest) => void;
}

export const userSlice: StateCreator<UserSlice> = (set, get) => ({
  userLogged: undefined,
  activeFriend: undefined,
  friends: [],
  friendshipRequests: [],
  login: (user: User) => {
    set({ userLogged: user });
  },
  logout: () => {
    set({ userLogged: undefined });
  },
  addFriendList: (friends) => {
    set({ friends });
  },
  addFriend: (friend: User) => {
    const friends = get().friends;
    friends.push(friend);
    set({ friends });
  },
  setActiveFriend: (friend: User) => {
    set({ activeFriend: friend });
  },
  addFriendshipRequestList: (friendshipRequests: FriendshipRequest[]) => {
    set({ friendshipRequests });
  },
  addFriendshipRequest: (friendshipRequest: FriendshipRequest) => {
    const friendshipRequests = get().friendshipRequests;
    friendshipRequests.push(friendshipRequest);    
    set({ friendshipRequests });
  },
});
