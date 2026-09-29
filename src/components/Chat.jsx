import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);

  const userId = user?._id;

  const targetUser = connections?.find(
    (connection) => connection._id === targetUserId
  );

  // Fetch old messages
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(
        BASE_URL + "/chat/" + targetUserId,
        {
          withCredentials: true,
        }
      );

      const chatMessages =
        chat?.data?.messages?.map((msg) => {
          const { senderId, text, createdAt } = msg;

          return {
            firstName: senderId?.firstName,
            lastName: senderId?.lastName,
            text,
            timestamp: createdAt,
          };
        }) || [];

      setMessages(chatMessages);
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  // Socket connection
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on(
      "messageReceived",
      ({ firstName, lastName, text, timestamp }) => {
        setMessages((prev) => [
          ...prev,
          {
            firstName,
            lastName,
            text,
            timestamp,
          },
        ]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      {/* Header */}
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-none">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
        </div>

        <div className="flex-1 flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={
                  targetUser?.photoUrl ||
                  `https://ui-avatars.com/api/?name=${
                    targetUser?.firstName || "User"
                  }`
                }
                alt="user"
              />
            </div>
          </div>

          <span className="font-bold text-lg">
            {targetUser?.firstName || "User"}{" "}
            {targetUser?.lastName || ""}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              "chat " +
              (user?.firstName === msg.firstName
                ? "chat-end"
                : "chat-start")
            }
          >
            <div className="chat-header">
              {msg.firstName} {msg.lastName}

              {msg.timestamp && (
                <time className="text-xs opacity-50 ml-2">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              )}
            </div>

            <div className="chat-bubble">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input input-bordered flex-1"
          placeholder={`Message ${targetUser?.firstName || "User"}...`}
        />

        <button
          className="btn btn-secondary"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;