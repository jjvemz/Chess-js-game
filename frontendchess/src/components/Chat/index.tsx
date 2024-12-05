import { useState, useEffect } from "react";
import socket from "../../utils/sockets";
import "./chat.css";

const Chat = ({ roomId }: { roomId: string } ) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if(roomId){
      socket.emit('joinRoom', { roomId })
    }

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit('leaveRoom', { roomId });
    };
  }, [roomId]);

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
