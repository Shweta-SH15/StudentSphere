// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { API_BASE } from "@/lib/api";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/sonner";

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
//   const token = localStorage.getItem("immigrantConnect_token");

//   const [contacts, setContacts] = useState<UserSummary[]>([]);
//   const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/profile/friends`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setContacts(data || []);
//       } catch {
//         toast.error("Failed to load contacts");
//       }
//     };
//     fetchContacts();
//   }, []);

//   useEffect(() => {
//     if (!selectedUser) return;

//     const fetchMessages = async () => {
//       try {
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

//     const body = { receiverId: selectedUser._id, content: newMessage };

//     try {
//       const res = await fetch(`${API_BASE}/chat/send`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(body),
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
//       <div className="border-r overflow-y-auto p-4">
//         <h2 className="text-xl font-bold mb-4">Chats</h2>
//         {contacts.map((c) => (
//           <div
//             key={c._id}
//             onClick={() => setSelectedUser(c)}
//             className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
//               selectedUser?._id === c._id ? "bg-gray-200" : ""
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
//             <div className="flex-1 overflow-y-auto mb-4">
//               {messages.map((m, idx) => (
//                 <div
//                   key={idx}
//                   className={`mb-2 p-2 rounded max-w-md ${
//                     m.sender === user?._id
//                       ? "bg-blue-100 self-end text-right"
//                       : "bg-gray-100 self-start text-left"
//                   }`}
//                 >
//                   <p>{m.content}</p>
//                   <span className="block text-xs text-gray-500 mt-1">
//                     {new Date(m.timestamp).toLocaleTimeString()}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <Input
//                 placeholder="Type your message..."
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//               />
//               <Button onClick={handleSendMessage}>Send</Button>
//             </div>
//           </>
//         ) : (
//           <p className="text-center text-gray-500 mt-8">
//             Select a user to start chatting.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessagesPage;

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/lib/api";
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

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = await getIdToken(getAuth().currentUser!, true);
        const res = await fetch(`${API_BASE}/profile/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setContacts(data || []);
      } catch {
        toast.error("Failed to load contacts");
      }
    };

    if (user) fetchContacts();
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      <div className="border-r overflow-y-auto p-4 bg-[#121826] text-white">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        {contacts.map((c) => (
          <div
            key={c._id}
            onClick={() => setSelectedUser(c)}
            className={`p-2 rounded cursor-pointer hover:bg-[#1f2937] ${
              selectedUser?._id === c._id ? "bg-[#1f2937]" : ""
            }`}
          >
            <div className="font-semibold">{c.name}</div>
          </div>
        ))}
      </div>

      <div className="col-span-2 p-4 flex flex-col h-full">
        {selectedUser ? (
          <>
            <h2 className="text-lg font-semibold mb-2 border-b pb-2">
              Chat with {selectedUser.name}
            </h2>
            <div className="flex-1 overflow-y-auto mb-4 space-y-2 px-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-md px-4 py-2 rounded shadow ${
                    m.sender === user?._id
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-100 text-black self-start"
                  }`}
                >
                  <p>{m.content}</p>
                  <span className="block text-xs text-gray-300 mt-1 text-right">
                    {new Date(m.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-auto">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 mt-8">
            Select a user to start chatting.
          </p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
