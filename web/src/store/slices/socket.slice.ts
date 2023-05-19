import io, { Socket } from 'socket.io-client';
import { StateCreator } from 'zustand';

export interface RealtimeSlice {
  isOnline: boolean;
  socket?: Socket;
}

export const realtimeSlice: StateCreator<RealtimeSlice> = (set, get) => {
  const socket = io('http://localhost:3003');

  socket
    .on('connect', () => {
      set({ isOnline: true });
    })
    .on('disconnect', () => {
      set({ isOnline: false });
    });

  return {
    isOnline: false,
    socket,
  };
};
