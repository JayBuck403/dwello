
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io("https://dwello-backend-express.onrender.com", {
      transports: ["websocket"],
      withCredentials: true,
    });
  }
  return socket;
}