
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io("http://localhost:8000", {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  return socket;
}