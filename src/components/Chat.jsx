import { Fragment, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { createSocketConnection } from "../utils/socket";
import { BASE_URL, avatarFor } from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import { ArrowLeftIcon, SendIcon, ChatIcon } from "./ui/Icons";

// ---------- Helpers (component ke BAHAR — inme koi hook nahi hai) ----------

const formatTime = (ts) =>
  ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

const dayLabel = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ---------- State ----------
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false); // saamne wala type kar raha hai?

  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const userId = user?._id;
  const targetUser = connections?.find((c) => c._id === targetUserId);

  // ---------- Refs (badalne pe re-render nahi hota) ----------
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Direct /chat/:id khola ho toh connections Redux mein nahi honge
  useEffect(() => {
    if (connections || !userId) return;
    axios
      .get(BASE_URL + "/user/connections", { withCredentials: true })
      .then((res) => dispatch(addConnections(res.data.data)))
      .catch(console.error);
  }, [connections, userId, dispatch]);

  // Purani chat history load karo
  useEffect(() => {
    const fetchChatMessages = async () => {
      setLoading(true);
      try {
        const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, { withCredentials: true });
        const history =
          chat?.data?.messages?.map((msg) => ({
            senderId: msg.senderId?._id,
            firstName: msg.senderId?.firstName,
            lastName: msg.senderId?.lastName,
            text: msg.text,
            timestamp: msg.createdAt,
            seen: msg.seen,
          })) || [];
        setMessages(history);
      } catch (err) {
        console.error("Error fetching chat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChatMessages();
  }, [targetUserId]);

  // Ek chat screen = ek socket connection
  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });

    // Chat khuli → saamne wale ke purane messages "seen"
    socket.emit("markSeen", { userId, targetUserId });

    socket.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);

      // Saamne wale ka message aaya aur chat khuli hai → turant seen
      if (msg.senderId && msg.senderId !== userId) {
        setIsTyping(false);
        socket.emit("markSeen", { userId, targetUserId });
      }
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));

    // Saamne wale ne mere messages padh liye → mere saare messages seen
    socket.on("messagesSeen", () => {
      setMessages((prev) =>
        prev.map((m) => (m.senderId === userId ? { ...m, seen: true } : m))
      );
    });

    return () => {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      socket.disconnect(); // page chhodne pe cleanup
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, targetUserId]);

  // Naya message / typing aaye toh neeche scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Har key pe chalta hai — "typing" debounce ke saath bhejta hai
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    const socket = socketRef.current;
    if (!socket) return;

    // Pehli key pe hi "typing" bhejo, har key pe nahi
    if (!typingTimeoutRef.current) {
      socket.emit("typing", { userId, targetUserId });
    } else {
      clearTimeout(typingTimeoutRef.current);
    }

    // 1.5 sec tak koi key nahi → "stopTyping"
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { userId, targetUserId });
      typingTimeoutRef.current = null;
    }, 1500);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text,
    });

    // Message bhej diya → typing band
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = null;
    socketRef.current.emit("stopTyping", { userId, targetUserId });

    setNewMessage("");
  };

  // senderId ho toh usse match karo, warna naam se (purane backend ke liye)
  const isMine = (msg) =>
    msg.senderId ? msg.senderId === userId : msg.firstName === user?.firstName;

  const name = targetUser ? `${targetUser.firstName} ${targetUser.lastName || ""}` : "Developer";

  return (
    <div className="max-w-3xl mx-auto glass-card rounded-box overflow-hidden flex flex-col h-[calc(100vh-14rem)] min-h-[480px] animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-base-content/10 bg-base-200/60">
        <button className="btn btn-ghost btn-circle btn-sm" onClick={() => navigate(-1)} aria-label="Back">
          <ArrowLeftIcon />
        </button>
        <img
          src={targetUser?.photoUrl || avatarFor(targetUser?.firstName, targetUser?.lastName)}
          alt={name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40"
        />
        <div className="min-w-0">
          <p className="font-semibold truncate">{name}</p>
          <p className="font-mono text-[11px]">
            {isTyping ? (
              <span className="text-success">typing…</span>
            ) : (
              <span className="text-base-content/50">real-time · socket.io</span>
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-5 space-y-1">
        {loading && (
          <div className="flex justify-center py-10">
            <span className="loading loading-dots loading-md text-primary" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="h-full grid place-items-center text-center text-base-content/50">
            <div>
              <ChatIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Say hi to {targetUser?.firstName || "your match"} 👋</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const mine = isMine(msg);
          const prev = messages[index - 1];

          // Pichhle message se date alag hai → divider dikhao
          const showDate =
            !prev ||
            new Date(prev.timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

          return (
            <Fragment key={index}>
              {showDate && (
                <div className="divider text-xs font-mono opacity-60">
                  {dayLabel(msg.timestamp)}
                </div>
              )}

              <div className={`chat ${mine ? "chat-end" : "chat-start"}`}>
                <div
                  className={`chat-bubble max-w-[80%] text-sm ${
                    mine
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-content"
                      : "bg-base-300 text-base-content"
                  }`}
                >
                  {msg.text}
                </div>

                <div className="chat-footer opacity-50 text-[11px] font-mono mt-0.5">
                  {formatTime(msg.timestamp)}
                  {mine && (
                    <span className={msg.seen ? "text-secondary ml-1" : "ml-1"}>
                      {msg.seen ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}

        {/* Typing bubble (saamne wale ki side) */}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-300 text-base-content">
              <span className="loading loading-dots loading-sm" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-base-content/10 flex items-center gap-2 bg-base-200/60"
      >
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          className="input flex-1 bg-base-100/70 focus:border-primary"
          placeholder={`Message ${targetUser?.firstName || ""}…`}
          aria-label="Message"
        />
        <button
          type="submit"
          className="btn btn-primary btn-square"
          disabled={!newMessage.trim()}
          aria-label="Send"
        >
          <SendIcon className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
