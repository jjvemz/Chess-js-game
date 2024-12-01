import {useState, useEffect} from 'react';
import socket from '../../utils/sockets';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(()=>{
    socket.on('message', (message) =>{
      setMessages([...messages, message]);
    })
  },[messages]);

  const sendMessage = () =>{
    socket.emit('message', newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <div className="chat">
          {messages.map((msg, index) =>(
            <div key={index}>{msg}</div>
          ))}
      </div>
      <div className="input">
        <input 
        type="text" 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}/>
        <button onClick={sendMessage}>Enviar mensaje</button>
      </div>
    </div>
  )
}

export default Chat