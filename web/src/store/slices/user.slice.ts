import { StateCreator } from 'zustand';

export type User = {
  name: string;
  socketId: string;
  email: string;
};

export interface UserSlice {
  userLogged: User | undefined;
  login: (user: User) => void;
}

export const userSlice: StateCreator<UserSlice> = (set) => ({
  userLogged: undefined,
  login: (user: User) => {
    set({ userLogged: user });
  },
});
