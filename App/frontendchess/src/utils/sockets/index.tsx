import { io } from "socket.io-client";

console.log('Initializing socket connection...');
const port = import.meta.env.VITE_PORT || 3001;  
const SOCKET_URL = process.env.REACT_APP_WS_URL
console.log('Using port:', port);

const socket = io(`${SOCKET_URL}`, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

// Log all socket events for debugging
socket.onAny((event, ...args) => {
    console.log('Socket Event:', event, 'Args:', args);
});

socket.on('connect', () => {
    console.log('Socket connected successfully! Socket ID:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected. Reason:', reason);
});

// Check initial connection state
console.log('Initial socket connection state:', socket.connected ? 'Connected' : 'Disconnected');

export default socket;