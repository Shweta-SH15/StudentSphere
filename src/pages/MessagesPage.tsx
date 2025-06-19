// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { API_BASE } from "@/lib/api";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/sonner";
// import { getAuth, getIdToken } from "firebase/auth";

// interface Message {
//   sender: string;
//   receiver: string;
//   content: string;
//   timestamp: string;
// }

// interface UserSummary {
//   _id: string;
//   name: string;
//   profileImage?: string;
// }

// const MessagesPage = () => {
//   const { user } = useAuth();

//   const [contacts, setContacts] = useState<UserSummary[]>([]);
//   const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const token = await getIdToken(getAuth().currentUser!, true);
//         const res = await fetch(`${API_BASE}/profile/friends`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setContacts(data || []);
//       } catch {
//         toast.error("Failed to load contacts");
//       }
//     };

//     if (user) fetchContacts();
//   }, [user]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!selectedUser) return;

//       try {
//         const token = await getIdToken(getAuth().currentUser!, true);
//         const res = await fetch(
//           `${API_BASE}/chat/messages?withUserId=${selectedUser._id}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const data = await res.json();
//         setMessages(data || []);
//       } catch {
//         toast.error("Failed to load messages");
//       }
//     };

//     fetchMessages();
//   }, [selectedUser]);

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedUser) return;

//     try {
//       const token = await getIdToken(getAuth().currentUser!, true);

//       const res = await fetch(`${API_BASE}/chat/send`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ receiverId: selectedUser._id, content: newMessage }),
//       });

//       if (!res.ok) throw new Error("Failed to send");

//       const saved = await res.json();
//       setMessages([...messages, saved]);
//       setNewMessage("");
//     } catch {
//       toast.error("Failed to send message");
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
//       <div className="border-r overflow-y-auto p-4 bg-[#121826] text-white">
//         <h2 className="text-xl font-bold mb-4">Chats</h2>
//         {contacts.map((c) => (
//           <div
//             key={c._id}
//             onClick={() => setSelectedUser(c)}
//             className={`p-2 rounded cursor-pointer hover:bg-[#1f2937] ${
//               selectedUser?._id === c._id ? "bg-[#1f2937]" : ""
//             }`}
//           >
//             <div className="font-semibold">{c.name}</div>
//           </div>
//         ))}
//       </div>

//       <div className="col-span-2 p-4 flex flex-col h-full">
//         {selectedUser ? (
//           <>
//             <h2 className="text-lg font-semibold mb-2 border-b pb-2">
//               Chat with {selectedUser.name}
//             </h2>
//             <div className="flex-1 overflow-y-auto mb-4 space-y-2 px-2">
//               {messages.map((m, idx) => (
//                 <div
//                   key={idx}
//                   className={`max-w-md px-4 py-2 rounded shadow ${
//                     m.sender === user?._id
//                       ? "bg-blue-500 text-white self-end ml-auto"
//                       : "bg-gray-100 text-black self-start"
//                   }`}
//                 >
//                   <p>{m.content}</p>
//                   <span className="block text-xs text-gray-300 mt-1 text-right">
//                     {new Date(m.timestamp).toLocaleTimeString()}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-2 mt-auto">
//               <Input
//                 placeholder="Type your message..."
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//               />
//               <Button onClick={handleSendMessage}>Send</Button>
//             </div>
//           </>
//         ) : (
//           <p className="text-center text-gray-400 mt-8">
//             Select a user to start chatting.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessagesPage;

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE, SOCKET_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { getAuth, getIdToken } from "firebase/auth";

interface Message {
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

interface UserSummary {
  _id: string;
  name: string;
  profileImage?: string;
}

const MessagesPage = () => {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<UserSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchContacts = async () => {
      try {
        const token = await getIdToken(getAuth().currentUser!, true);
        const res = await fetch(`${API_BASE}/profile/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const local = JSON.parse(localStorage.getItem("likedFriends") || "[]");
        const combined = [...data, ...local.filter((f: any) => f._id?.startsWith("mock-"))];
        setContacts(combined);
      } catch {
        toast.error("Failed to load contacts");
      }
    };

    fetchContacts();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;

      try {
        const token = await getIdToken(getAuth().currentUser!, true);
        const res = await fetch(
          `${API_BASE}/chat/messages?withUserId=${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setMessages(data || []);
      } catch {
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const token = await getIdToken(getAuth().currentUser!, true);

      const res = await fetch(`${API_BASE}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId: selectedUser._id, content: newMessage }),
      });

      if (!res.ok) throw new Error("Failed to send");

      const saved = await res.json();
      setMessages([...messages, saved]);
      setNewMessage("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  const renderAvatar = (user: UserSummary) => {
    const src = user.profileImage?.startsWith("/uploads/")
      ? `${SOCKET_URL}${user.profileImage}`
      : user.profileImage || "/uploads/default.png";
    return (
      <img
        src={src}
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover mr-2"
      />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen bg-[#0a0f1a] text-white">
      {/* Sidebar */}
      <div className="border-r border-gray-700 overflow-y-auto p-4 bg-[#121826]">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {contacts.map((c) => (
          <div
            key={c._id}
            onClick={() => setSelectedUser(c)}
            className={`p-2 rounded cursor-pointer flex items-center hover:bg-[#1f2937] ${
              selectedUser?._id === c._id ? "bg-[#1f2937]" : ""
            }`}
          >
            {renderAvatar(c)}
            <div className="font-medium">{c.name}</div>
          </div>
        ))}
      </div>

      {/* Chat window */}
      <div className="col-span-2 p-4 flex flex-col h-full">
        {selectedUser ? (
          <>
            <div className="border-b pb-2 mb-4 text-lg font-semibold">
              Chat with {selectedUser.name}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 px-1">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-md px-4 py-2 rounded-lg text-sm ${
                    m.sender === user?._id
                      ? "bg-blue-600 ml-auto text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{m.content}</p>
                  <div className="text-xs mt-1 text-right text-gray-300">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            <div className="flex mt-4 gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-[#1f2937] text-white border-gray-600"
              />
              <Button onClick={handleSendMessage} className="bg-green-600 hover:bg-green-700">
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
 
