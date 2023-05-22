import { StateCreator } from 'zustand';

export type User = {
  name: string;
  socketId: string;
  email: string;
};

export interface UserSlice {
  userLogged: User | undefined;
  activeFriend: User | undefined;
  friends: User[];
  login: (user: User) => void;
  logout: () => void;
  addFriendList: (friends: User[]) => void;
  addFriend: (friend: User) => void;
  setActiveFriend: (friend: User) => void;
}

export const userSlice: StateCreator<UserSlice> = (set, get) => ({
  userLogged: undefined,
  activeFriend: undefined,
  friends: [],
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
});
