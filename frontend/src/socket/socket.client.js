import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || axiosInstance.defaults.baseURL, {
      autoConnect: false,
      withCredentials: true,
    });
  }

  if (!socket.connected) socket.connect();
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = undefined;
};
