import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SOCKET_URL } from "@/lib/api";
interface Message {
  from: string;
  to: string;
  message: string;
  timestamp: Date;
}

const ChatContext = createContext<any>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let newSocket: Socket | null = null;
  
    if (user) {
      newSocket = io(SOCKET_URL, {
        auth: { tokenUserId: user._id }
      });
  
      newSocket.on("receiveMessage", (msg: Message) => {
        setMessages(prev => [...prev, msg]);
      });
  
      setSocket(newSocket);
    }
  
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);
  

  const sendMessage = (to: string, message: string) => {
    if (socket) {
      socket.emit("sendMessage", { to, message });
      setMessages(prev => [...prev, { from: user._id, to, message, timestamp: new Date() }]);
    }
  };

  return (
    <ChatContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
