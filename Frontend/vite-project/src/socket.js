// src/socket.js
import { io } from 'socket.io-client';

export function createSocket() {
  const socket = io(import.meta.env.VITE_API_BASE, { transports: ['websocket'] });
  return socket;
}
