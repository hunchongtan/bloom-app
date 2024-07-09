// src/NewEntry.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home/NewEntry.css';
import JournalsNav from "./JournalsNav";
import { MdArrowForwardIos, MdArrowBackIos, MdArrowCircleRight } from "react-icons/md";
import DateTimeHeader from './DateTimeHeader';



const NewEntry = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentBotMessageIndex, setCurrentBotMessageIndex] = useState(0);

  const userId = '12345';  // Example user ID, replace with actual user ID
  const chatId = '67890';  // Example chat ID, replace with actual chat ID

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Initialize with the first bot message
    setMessages([{ text: botMessages[0].text, sender: 'bot' }]);
  }, []);

  const handleBackClick = () => {
    console.log("Back button clicked");
    navigate('/'); // Navigate to home page
  };

  const handleNextMessage = () => {
    const nextIndex = (currentBotMessageIndex + 1) % botMessages.length;
    setCurrentBotMessageIndex(nextIndex);
    setMessages([{ text: botMessages[nextIndex].text, sender: 'bot' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    const formData = new FormData();
    formData.append('text', input);
    formData.append('user_id', userId);
    formData.append('chat_id', chatId);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('http://localhost:8000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input, user_id: userId, chat_id: chatId }),
      });
      const data = await response.json();
      const botMessage = { text: data.sentiment, sender: 'bot' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
  };

  return (
    <div className="NewEntry">
      <div className="chat-header">
        <button className="back-button" onClick={handleBackClick}>
          <MdArrowBackIos />
          </button>
        <div className="header-content">
          <JournalsNav />
        </div>
      </div>
      <div className="chat-window">
      <DateTimeHeader />
      {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === 'bot' ? 'bot' : 'user'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        {/* <button className="camera-button">📷</button> */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your entry here"
        />
        <button type="submit" className="send-button">
          <MdArrowForwardIos />
          </button>
      </form>
    </div>
  );
};

export default NewEntry;
