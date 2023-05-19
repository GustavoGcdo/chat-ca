import { StateCreator } from 'zustand';
import { User } from './user.slice';

export type Message = {
  user: User;
  text: string;
};

export interface MessageSlice {
  messages: Message[];
  addMessage: (message: Message) => void;
  setInitialMessages: (message: Message[]) => void;
}

export const messageSlice: StateCreator<MessageSlice> = (set, get) => ({
  messages: [],
  setInitialMessages: (messages: Message[]) => {
    set({ messages });
  },
  addMessage: (message: Message) => {
    const messages = get().messages;
    messages.push(message);
    set({ messages });
  },
});
