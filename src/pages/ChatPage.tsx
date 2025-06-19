// import { useEffect, useRef, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useSearchParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { getAuth } from "firebase/auth";
// import { io } from "socket.io-client";

// const ChatPage = () => {
//   const { user } = useAuth();
//   const [searchParams] = useSearchParams();
//   const receiverId = searchParams.get("with") || "";
//   const [text, setText] = useState("");
//   const [messages, setMessages] = useState([]);
//   const socketRef = useRef(null);
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     const connectSocket = async () => {
//       const currentUser = getAuth().currentUser;
//       const token = await currentUser.getIdToken(true);

//       const socket = io(import.meta.env.VITE_SOCKET_URL, {
//         auth: { token },
//         transports: ["websocket", "polling"],
//       });

//       socketRef.current = socket;

//       socket.on("connect", () => console.log("Connected to socket"));
//       socket.on("disconnect", () => console.log("Disconnected from socket"));

//       socket.on("receiveMessage", (msg) => {
//         setMessages((prev) => [...prev, msg]);
//       });

//       return () => {
//         socket.disconnect();
//       };
//     };

//     connectSocket();
//   }, []);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_API_BASE_URL}/chat/messages?withUserId=${receiverId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("immigrantConnect_token")}`,
//             },
//           }
//         );
//         const data = await res.json();
//         setMessages(data);
//       } catch (err) {
//         console.error("Failed to fetch chat history", err);
//       }
//     };

//     if (receiverId && user) fetchHistory();
//   }, [receiverId, user]);

//   const handleSend = () => {
//     if (!text.trim()) return;

//     const msg = {
//       from: user._id,
//       to: receiverId,
//       text,
//       timestamp: new Date().toISOString(),
//     };

//     socketRef.current.emit("sendMessage", msg);
//     setMessages((prev) => [...prev, msg]);
//     setText("");
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="min-h-screen bg-[#0a0f1a] text-white flex justify-center items-center p-4">
//       <div className="w-full max-w-2xl bg-[#121826] rounded-lg shadow-md flex flex-col h-[600px]">
//         <div className="p-4 border-b border-gray-700 text-lg font-semibold">
//           Chat
//         </div>

//         <div
//           ref={chatContainerRef}
//           className="flex-1 overflow-y-auto p-4 space-y-3"
//         >
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`p-3 max-w-[70%] rounded-lg text-sm ${
//                 msg.from === user._id
//                   ? "bg-green-600 ml-auto text-right"
//                   : "bg-gray-700 mr-auto text-left"
//               }`}
//             >
//               <p>{msg.text}</p>
//               <p className="text-[10px] text-gray-300 mt-1">
//                 {new Date(msg.timestamp).toLocaleTimeString()}
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="p-4 border-t border-gray-700 flex items-center gap-2">
//           <input
//             type="text"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 px-4 py-2 rounded bg-[#1f2937] text-white focus:outline-none"
//           />
//           <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700">
//             Send
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { io } from "socket.io-client";

const ChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("with") || "";
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const connectSocket = async () => {
      const currentUser = getAuth().currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken(true);
      const socket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
      });

      socketRef.current = socket;

      socket.on("connect", () => console.log("✅ Connected to socket"));
      socket.on("disconnect", () => console.log("🔌 Disconnected from socket"));
      socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));

      return () => socket.disconnect();
    };

    if (user) connectSocket();
  }, [user]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/chat/messages?withUserId=${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("immigrantConnect_token")}`,
            },
          }
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };

    if (receiverId && user) fetchHistory();
  }, [receiverId, user]);

  const handleSend = () => {
    if (!text.trim()) return;

    const msg = {
      from: user._id,
      to: receiverId,
      text,
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-[#121826] rounded-lg shadow-md flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-700 text-lg font-semibold">
          Chat
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 max-w-[70%] rounded-lg text-sm ${
                msg.from === user._id
                  ? "bg-green-600 ml-auto text-right"
                  : "bg-gray-700 mr-auto text-left"
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-[10px] text-gray-300 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700 flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded bg-[#1f2937] text-white focus:outline-none"
          />
          <Button onClick={handleSend} className="bg-green-600 hover:bg-green-700">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
