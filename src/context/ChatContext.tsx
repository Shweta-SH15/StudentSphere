// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";
// import { useAuth } from "./AuthContext";
// import { SOCKET_URL } from "@/lib/api";

// interface Message {
//   from: string;
//   to: string;
//   message: string;
//   timestamp: Date;
// }

// interface ChatContextType {
//   socket: Socket | null;
//   messages: Message[];
//   sendMessage: (to: string, message: string) => void;
// }

// const ChatContext = createContext<ChatContextType | null>(null);

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user } = useAuth();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);

//   useEffect(() => {
//     let newSocket: Socket | null = null;

//     if (user?._id) {
//       newSocket = io(SOCKET_URL, {
//         auth: { tokenUserId: user._id }
//       });

//       newSocket.on("receiveMessage", (msg: Message) => {
//         setMessages(prev => [...prev, msg]);
//       });

//       setSocket(newSocket);
//     }

//     return () => {
//       newSocket?.disconnect();
//     };
//   }, [user]);

//   const sendMessage = (to: string, message: string) => {
//     if (!socket || !user?._id) return;

//     const msg: Message = {
//       from: user._id,
//       to,
//       message,
//       timestamp: new Date()
//     };

//     socket.emit("sendMessage", msg);
//     setMessages(prev => [...prev, msg]);
//   };

//   return (
//     <ChatContext.Provider value={{ socket, messages, sendMessage }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = (): ChatContextType => {
//   const context = useContext(ChatContext);
//   if (!context) throw new Error("useChat must be used within a ChatProvider");
//   return context;
// };

// ChatContext.tsx

// ChatContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { API_BASE, SOCKET_URL } from "@/lib/api";

interface ChatContextProps {
  socket: Socket | null;
  messages: any[];
  sendMessage: (to: string, message: string) => void;
}

const ChatContext = createContext<ChatContextProps>({
  socket: null,
  messages: [],
  sendMessage: () => {},
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    // ✅ Wait for Firebase Auth to be ready
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken(true);

          const newSocket = io(SOCKET_URL, {
            auth: {
              token,
            },
            transports: ["websocket", "polling"],
            reconnectionAttempts: 5,
            timeout: 20000,  // Set a longer timeout for better stability
          });

          newSocket.on("connect", () => {
            console.log("🟢 Connected to socket server:", newSocket.id);
          });

          newSocket.on("disconnect", () => {
            console.log("🔴 Disconnected from socket server");
          });

          newSocket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });

          setSocket(newSocket);
          setIsAuthReady(true);

        } catch (err) {
          console.error("Socket connection error:", err);
        }
      } else {
        console.error("User not authenticated - cannot connect to socket");
      }
    });

    // ✅ Clean up on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("🔴 Socket disconnected on cleanup");
      }
      unsubscribe();
    };
  }, []);

  const sendMessage = (to: string, message: string) => {
    if (!socket) return console.error("Socket not connected");
    socket.emit("sendMessage", { from: getAuth().currentUser?.uid, to, message });
  };

  return (
    <ChatContext.Provider value={{ socket, messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
