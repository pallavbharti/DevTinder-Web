import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Avatar from "./Avatar";

// ---------- Helpers (component ke bahar — inme koi hook nahi) ----------
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

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const userId = user?._id;
  const targetUser = connections?.find((c) => c._id === targetUserId);

  // useRef: value yaad rehti hai, par badalne pe re-render nahi hota
  const socketRef = useRef(null);       // ek hi socket poori chat ke liye
  const bottomRef = useRef(null);       // auto-scroll ke liye
  const typingTimeoutRef = useRef(null);

  // Purani chat history
  useEffect(() => {
    axios
      .get(BASE_URL + "/chat/" + targetUserId, { withCredentials: true })
      .then((chat) => {
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
      })
      .catch((err) => console.error("Error fetching chat:", err))
      .finally(() => setLoading(false));
  }, [targetUserId]);

  // Socket: ek chat = ek connection
  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });
    socket.emit("markSeen", { userId, targetUserId }); // chat khuli → unke messages "seen"

    socket.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.senderId && msg.senderId !== userId) {
        setIsTyping(false);
        socket.emit("markSeen", { userId, targetUserId });
      }
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
    socket.on("messagesSeen", () => {
      setMessages((prev) => prev.map((m) => (m.senderId === userId ? { ...m, seen: true } : m)));
    });

    return () => {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      socket.disconnect(); // page chhodne pe connection band
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, targetUserId]);

  // Naya message / typing → neeche scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  // Typing: pehli key pe "typing", 1.5s ruk gaye toh "stopTyping" (har key pe event nahi)
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    const socket = socketRef.current;
    if (!socket) return;
    if (!typingTimeoutRef.current) socket.emit("typing", { userId, targetUserId });
    else clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { userId, targetUserId });
      typingTimeoutRef.current = null;
    }, 1500);
  };

  // BUG FIX: pehle har Send pe NAYA socket banta tha (createSocketConnection())
  // aur kabhi band nahi hota tha → 20 message = 20 khule connections.
  // Ab wahi ek socket (socketRef) use hota hai.
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

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = null;
    socketRef.current.emit("stopTyping", { userId, targetUserId });
    setNewMessage("");
  };

  // BUG FIX: pehle "mera message" firstName se pehchante the —
  // dono ka naam "Rahul" ho toh dono taraf galat dikhta. Ab senderId (unique) se.
  const isMine = (msg) =>
    msg.senderId ? msg.senderId === userId : msg.firstName === user?.firstName;

  const name = targetUser ? `${targetUser.firstName} ${targetUser.lastName || ""}` : "Chat";

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="h-16 px-3 sm:px-5 flex items-center gap-3 border-b border-base-300 bg-base-100 shrink-0">
        <Link to="/connections" className="btn btn-ghost btn-sm btn-circle md:hidden" aria-label="Back to messages">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
        <Avatar user={targetUser} size={38} />
        <div className="min-w-0">
          <p className="font-semibold truncate leading-tight">{name}</p>
          <p className="text-xs h-4">
            {isTyping ? <span className="text-accent">typing…</span> : <span className="opacity-50">{targetUser?.skills?.slice(0, 3).join(" · ")}</span>}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto thin-scroll bg-base-200 px-3 sm:px-6 py-4">
        {loading && (
          <div className="flex justify-center py-10">
            <span className="loading loading-dots loading-md opacity-50" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="h-full grid place-items-center text-center">
            <div>
              <Avatar user={targetUser} size={64} className="mx-auto" />
              <p className="mt-3 font-medium">You're connected with {targetUser?.firstName || "them"}</p>
              <p className="text-sm opacity-60">Say hello and start the conversation.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1 max-w-3xl mx-auto">
          {messages.map((msg, index) => {
            const mine = isMine(msg);
            const prev = messages[index - 1];
            const showDate =
              msg.timestamp &&
              (!prev || new Date(prev.timestamp).toDateString() !== new Date(msg.timestamp).toDateString());
            // same insaan ke lagataar messages paas-paas (group)
            const grouped = prev && isMine(prev) === mine && !showDate;

            return (
              <Fragment key={index}>
                {showDate && (
                  <div className="flex justify-center my-3">
                    <span className="text-xs px-3 py-1 rounded-full bg-base-100 border border-base-300 opacity-70">
                      {dayLabel(msg.timestamp)}
                    </span>
                  </div>
                )}
                <div className={`flex ${mine ? "justify-end" : "justify-start"} ${grouped ? "" : "mt-2"}`}>
                  <div
                    className={
                      "max-w-[78%] px-3.5 py-2 rounded-2xl text-[15px] leading-snug break-words " +
                      (mine
                        ? "bg-primary text-primary-content rounded-br-md"
                        : "bg-base-100 border border-base-300 rounded-bl-md")
                    }
                  >
                    <span className="whitespace-pre-wrap">{msg.text}</span>
                    <span className={`ml-2 text-[11px] align-bottom float-right mt-1.5 ${mine ? "opacity-75" : "opacity-50"}`}>
                      {formatTime(msg.timestamp)}
                      {mine && <span className="ml-1">{msg.seen ? "✓✓" : "✓"}</span>}
                    </span>
                  </div>
                </div>
              </Fragment>
            );
          })}

          {isTyping && (
            <div className="flex justify-start mt-2">
              <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-base-100 border border-base-300">
                <span className="loading loading-dots loading-xs opacity-60" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input — form hai, toh Enter dabane se bhi send hota hai */}
      <form onSubmit={sendMessage} className="p-3 border-t border-base-300 bg-base-100 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          className="input flex-1 bg-base-200 border-transparent"
          placeholder={`Message ${targetUser?.firstName || ""}…`}
          aria-label="Message"
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
