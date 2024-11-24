import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); 

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('chat_history', (messages) => {
      setChat(messages);
    });

    // Listen for new messages
    socket.on('message_received', (newMessage) => {
      setChat((prevChat) => [...prevChat, newMessage]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('chat_history');
      socket.off('message_received');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { id: Date.now(), text: message };
      socket.emit('new_message', newMessage); 
      setMessage(''); // Clear input
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chat en Tiempo Real</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {chat.map((msg) => (
          <div key={msg.id} style={{ margin: '5px 0' }}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '80%', marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default App;
