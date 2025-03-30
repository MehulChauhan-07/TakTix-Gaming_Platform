import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { socket: socketRef.current };
}; 