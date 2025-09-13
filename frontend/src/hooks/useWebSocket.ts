import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { AIRequest, AIResult, WebSocketMessage } from '../types';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to WebSocket');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
    });

    newSocket.on('connected', (data) => {
      console.log('Server connection confirmed:', data);
    });

    newSocket.on('ai_result', (data: AIResult) => {
      setMessages(prev => [...prev, {
        type: 'ai_result',
        data,
        timestamp: new Date().toISOString()
      }]);
    });

    newSocket.on('ai_processing', (data) => {
      setMessages(prev => [...prev, {
        type: 'ai_processing',
        data,
        timestamp: new Date().toISOString()
      }]);
    });

    newSocket.on('ai_error', (data) => {
      setMessages(prev => [...prev, {
        type: 'ai_error',
        data,
        timestamp: new Date().toISOString()
      }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendAIRequest = (request: AIRequest) => {
    if (socket && connected) {
      socket.emit('ai_request', request);
    }
  };

  const joinProject = (projectId: string) => {
    if (socket && connected) {
      socket.emit('join_project', projectId);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    socket,
    connected,
    messages,
    sendAIRequest,
    joinProject,
    clearMessages
  };
};