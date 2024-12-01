import { useState, useEffect } from "react";
import socket from "../../utils/sockets";
import "./chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = () => {
    socket.emit("message", newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <div className="message-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              index % 2 === 0 ? "sender-message" : "receiver-message"
            }`}
          >
            {msg}
          </div>
        ))}
      </div>
      <div className="message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escriba su mensaje..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
