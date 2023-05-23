import { create } from 'zustand';
import { UserSlice, userSlice } from './slices/user.slice';
import { MessageSlice, messageSlice } from './slices/message.slice';
import { RealtimeSlice, realtimeSlice } from './slices/socket.slice';

export const useRealtimeStore = create<RealtimeSlice>()((...a) => ({
  ...realtimeSlice(...a),
}));

export const useUserStore = create<UserSlice>()((...a) => ({
  ...userSlice(...a),
}));

export const useMessageStore = create<MessageSlice>()((...a) => ({
  ...messageSlice(...a),
}));
