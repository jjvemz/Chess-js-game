import { io } from "socket.io-client";

const port = import.meta.env.VITE_PORT;

const socket = io(`http://localhost:${port}`);

export default socket;