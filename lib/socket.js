// This file contains the socket connection logic used across the client components.

"use client";

import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
    });
  }
  return socket;
};
