import { io } from "socket.io-client";

console.log("Initializing socket connection...");

const SOCKET_URL = import.meta.env.REACT_APP_WS_URL;

if (!SOCKET_URL) {
  console.error("ERROR: REACT_APP_WS_URL no está definida en las variables de entorno.");
  throw new Error("No se puede inicializar la conexión WebSocket sin VITE_WS_URL.");
}

console.log("Connecting to WebSocket at:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  transports: ["websocket"], 
  autoConnect: true,         
  reconnection: true,        
  reconnectionAttempts: 5,   
  reconnectionDelay: 1000,   
});

socket.onAny((event, ...args) => {
  console.log("Socket Event:", event, "Args:", args);
});

socket.on("connect", () => {
  console.log("Socket connected successfully! Socket ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected. Reason:", reason);
});

console.log(
  "Initial socket connection state:",
  socket.connected ? "Connected" : "Disconnected"
);

export default socket;
