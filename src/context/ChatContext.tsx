// context/ChatContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getAuth, getIdToken } from "firebase/auth";
import { SOCKET_URL } from "@/lib/api";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const setup = async () => {
      const user = getAuth().currentUser;
      if (!user) return;
      const token = await getIdToken(user, true);
      const s = io(SOCKET_URL, { auth: { token } });
      setSocket(s);

      s.on("connect", () => console.log("✅ Connected to Socket"));
      s.on("disconnect", () => console.log("❌ Disconnected from Socket"));

      s.on("receiveMessage", (msg) => {
        console.log("📩 receiveMessage", msg);
        setMessages((prev) => [...prev, msg]); // ✅ must append whole message, not only timestamp
      });

      s.on("messageDelivered", (msg) => {
        console.log("✅ Delivered", msg);
        setMessages((prev) => [...prev, msg]);
      });

      return () => s.disconnect();
    };

    setup();
  }, []);

  const sendMessage = (receiverId, text) => {
    if (!socket) return;
    const user = getAuth().currentUser;
    socket.emit("sendMessage", {
      from: user?.uid,
      to: receiverId,
      text, // ✅ send text not content
    });
  };

  return (
    <ChatContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
