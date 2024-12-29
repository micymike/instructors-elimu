import { io } from 'socket.io-client';

// Create a socket instance
export const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Handle connection
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

// Handle connection errors
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Connect when user is authenticated
export const connectSocket = (userId: string) => {
  socket.auth = { userId };
  socket.connect();
};

// Disconnect when user logs out
export const disconnectSocket = () => {
  socket.disconnect();
};
