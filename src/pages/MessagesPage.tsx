import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { API_BASE, SOCKET_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { getAuth, getIdToken } from "firebase/auth";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  text?: string;
  timestamp?: string;
  createdAt?: string;
}

interface UserSummary {
  _id: string;
  name: string;
  profileImage?: string;
  firebaseUid?: string;
  gender?: string;
}

/* ------------------ Utility Functions ------------------ */

// Normalize message safely
const normalize = (m: any): Message => {
  if (!m) return { sender: "", receiver: "", text: "", timestamp: new Date().toISOString() };

  const text =
    m?.text ||
    m?.content ||
    m?.message ||
    m?.body ||
    m?.data?.text ||
    m?.data?.message ||
    "[No content]";

  return {
    _id: m?._id || m?.id || `${m?.sender}_${m?.timestamp}`,
    sender: m?.sender || m?.from || "",
    receiver: m?.receiver || m?.to || "",
    text,
    timestamp: m?.timestamp || m?.createdAt || new Date().toISOString(),
  };
};

// Get default profile image by gender
const getProfileImage = (user: UserSummary): string => {
  if (user.profileImage?.startsWith("/uploads/")) return `${SOCKET_URL}${user.profileImage}`;
  if (user.profileImage?.startsWith("http")) return user.profileImage;
  if (user.gender?.toLowerCase() === "male") return "/images/male.jpg";
  if (user.gender?.toLowerCase() === "female") return "/images/female.jpg";
  return "/images/other.jpg";
};

// Format date labels: “Today”, “Yesterday”, or full date
const getDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 3600 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString();
};

/* ------------------ Main Component ------------------ */

const MessagesPage = () => {
  const { user } = useAuth();
  const { socket, messages: socketMessages, sendMessage: sendSocketMessage } = useChat();

  const [contacts, setContacts] = useState<UserSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  /* 🔔 Request notification permission once */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => { });
    }
  }, []);

  /* 🧑 Load contacts (Firebase + Mock) */
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
      } catch (err) {
        console.error(err);
        toast.error("Failed to load contacts");
      }
    };
    fetchContacts();
  }, [user]);

  /* 💬 Load messages for selected contact */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !user) return;
      try {
        const token = await getIdToken(getAuth().currentUser!, true);
        const otherId = (selectedUser as any).firebaseUid || selectedUser._id;
        const res = await fetch(`${API_BASE}/chat/messages?withUserId=${otherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages((data || []).map(normalize));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load messages");
      }
    };
    fetchMessages();
  }, [selectedUser, user]);

  /* ⬇️ Auto-scroll to bottom */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 🔔 Handle real-time incoming socket messages */
  useEffect(() => {
    if (!selectedUser || !socketMessages?.length) return;
    const last = normalize(socketMessages[socketMessages.length - 1]);

    const meId = (user as any)?.firebaseUid || user?._id;
    const selId = (selectedUser as any)?.firebaseUid || selectedUser._id;

    const involvesSelected =
      (last.sender === selId && last.receiver === meId) ||
      (last.receiver === selId && last.sender === meId);

    if (involvesSelected && last.text && last.text !== "[No content]") {
      setMessages((prev) => [...prev, last]);
      toast(`💬 ${selectedUser.name}`, { description: last.text });

      // Browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`${selectedUser.name}`, { body: last.text });
      }
    }
  }, [socketMessages, selectedUser]);

  /* ✉️ Send message */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;

    const receiverId = (selectedUser as any).firebaseUid || selectedUser._id;
    const content = newMessage.trim();

    try {
      if (socket) {
        sendSocketMessage(receiverId, content);
      } else {
        const token = await getIdToken(getAuth().currentUser!, true);
        const res = await fetch(`${API_BASE}/chat/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ receiverId, content }),
        });
        const saved = await res.json();
        setMessages((prev) => [...prev, normalize(saved)]);
      }
      setNewMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  const renderAvatar = (u: UserSummary) => (
    <img
      src={getProfileImage(u)}
      alt={u.name}
      className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-700"
      onError={(e) => ((e.target as HTMLImageElement).src = "/images/other.jpg")}
    />
  );

  /* ------------------ JSX Layout ------------------ */

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1a] text-white">
      <Header />

      <main className="flex-grow flex overflow-hidden">
        {/* Contacts List */}
        <div className="w-full md:w-1/3 border-r border-gray-800 bg-[#121826] p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Chats</h2>
          {contacts.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedUser(c)}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition ${selectedUser?._id === c._id ? "bg-[#1f2937]" : "hover:bg-[#1f2937]"
                }`}
            >
              {renderAvatar(c)}
              <div>
                <div className="font-medium text-gray-100">{c.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 bg-[#0a0f1a]">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center p-4 border-b border-gray-800 bg-[#121826]">
                {renderAvatar(selectedUser)}
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.length > 0 ? (
                  (() => {
                    const grouped: Record<string, Message[]> = {};
                    messages.forEach((m) => {
                      const label = getDateLabel(m.timestamp!);
                      if (!grouped[label]) grouped[label] = [];
                      grouped[label].push(m);
                    });
                    return Object.entries(grouped).map(([date, msgs]) => (
                      <div key={date}>
                        <div className="text-center text-gray-400 text-xs my-2">{date}</div>
                        {msgs.map((m, idx) => {
                          const isMine =
                            (m.sender || "").toString() ===
                            ((user as any)?.firebaseUid || user?._id)?.toString();
                          return (
                            <div
                              key={m._id ?? idx}
                              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow ${isMine
                                  ? "bg-blue-600 ml-auto text-white"
                                  : "bg-[#1e293b] text-gray-100"
                                }`}
                            >
                              <p>{m.text || "[empty message]"}</p>
                              <div
                                className={`text-[10px] mt-1 text-right ${isMine ? "text-gray-200" : "text-gray-400"
                                  }`}
                              >
                                {new Date(
                                  m.timestamp ?? m.createdAt ?? Date.now()
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()
                ) : (
                  <div className="text-gray-400 text-center mt-4">No messages yet.</div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-[#121826] border-t border-gray-800 flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-[#1f2937] text-white border-gray-700 placeholder-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
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
      </main>

      <Footer />
    </div>
  );
};

export default MessagesPage;
