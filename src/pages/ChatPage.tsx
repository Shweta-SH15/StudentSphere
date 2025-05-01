import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ChatPage = () => {
  const { user } = useAuth();
  const { messages, sendMessage } = useChat();
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("with") || "";
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);

  // Load chat history from backend
  useEffect(() => {
    if (receiverId && user) {
      fetch(`http://localhost:5000/api/chat/messages?withUserId=${receiverId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("immigrantConnect_token")}`
        }
      })
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(err => console.error("Failed to load messages", err));
    }
  }, [receiverId, user]);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(receiverId, text.trim());
      setText("");
    }
  };

  const combinedMessages = [...history, ...messages].filter(
    msg =>
      (msg.from === user?._id && msg.to === receiverId) ||
      (msg.from === receiverId && msg.to === user?._id)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Chat</h2>

        <div className="flex-1 overflow-y-auto mb-4 max-h-[400px] border rounded p-2 space-y-2">
          {combinedMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded max-w-[70%] ${
                msg.from === user?._id ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded px-3 py-2"
          />
          <Button onClick={handleSend} className="bg-primary hover:bg-secondary">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
