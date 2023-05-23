import { StateCreator } from 'zustand';
import { User } from './user.slice';

export type Message = {
  sender: User;
  receiver: User;
  text: string;
  date: string;
};

export interface MessageSlice {
  messages: Message[];
  friendsWithNewMessages: User[];
  addMessage: (message: Message) => void;
  setInitialMessages: (message: Message[]) => void;
  addFriendWithNewMessages: (user: User) => void;
  removeFriendWithNewMessages: (user: User) => void;
}

export const messageSlice: StateCreator<MessageSlice> = (set, get) => ({
  messages: [],
  friendsWithNewMessages: [],
  setInitialMessages: (messages: Message[]) => {
    set({ messages });
  },
  addMessage: (message: Message) => {
    const messages = get().messages;
    messages.push(message);
    set({ messages });
  },
  addFriendWithNewMessages: (user: User) => {
    const friends = get().friendsWithNewMessages;
    friends.push(user);
    set({ friendsWithNewMessages: friends });
  },
  removeFriendWithNewMessages: (user: User) => {
    let friends = get().friendsWithNewMessages;
    friends = friends.filter(userToFind => userToFind.email !== user.email);
    set({ friendsWithNewMessages: friends });
  },
});
