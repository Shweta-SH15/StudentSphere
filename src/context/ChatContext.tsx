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

interface ChatContextType {
  socket: Socket | null;
  messages: Message[];
  sendMessage: (to: string, message: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let newSocket: Socket | null = null;

    if (user?._id) {
      newSocket = io(SOCKET_URL, {
        auth: { tokenUserId: user._id }
      });

      newSocket.on("receiveMessage", (msg: Message) => {
        setMessages(prev => [...prev, msg]);
      });

      setSocket(newSocket);
    }

    return () => {
      newSocket?.disconnect();
    };
  }, [user]);

  const sendMessage = (to: string, message: string) => {
    if (!socket || !user?._id) return;

    const msg: Message = {
      from: user._id,
      to,
      message,
      timestamp: new Date()
    };

    socket.emit("sendMessage", msg);
    setMessages(prev => [...prev, msg]);
  };

  return (
    <ChatContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
