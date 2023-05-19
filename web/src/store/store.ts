import { create } from 'zustand';
import { UserSlice, userSlice } from './slices/user.slice';
import { MessageSlice, messageSlice } from './slices/message.slice';
import { RealtimeSlice, realtimeSlice } from './slices/socket.slice';

type StoreState = UserSlice & MessageSlice & RealtimeSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...userSlice(...a),
  ...messageSlice(...a),
  ...realtimeSlice(...a),
}));
