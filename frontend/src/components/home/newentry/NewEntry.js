import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/newentry/NewEntry.css';
import JournalsNav from "./JournalsNav";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import DateTimeHeader from './DateTimeHeader';
import botMessages from '../../../botMessages.json';

const NewEntry = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentBotMessageIndex, setCurrentBotMessageIndex] = useState(0);
  const [canSendMessage, setCanSendMessage] = useState(true); // State to manage sending capability
  const [chatId, setChatId] = useState(null); // State to store chat ID

  const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Initialize with the first bot message
    setMessages([{ text: botMessages[0].text, sender: 'bot' }]);

    // Fetch chats and check if a message was sent today
    const initialize = async () => {
      const chats = await fetchChats(userId);
      const canSend = checkIfMessageSentToday(chats);
      setCanSendMessage(canSend === 0);

    }; 

    initialize();
  }, [userId]);

  const fetchChats = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/chats/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      const chats = await response.json();
      return chats;
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  };

  const checkIfMessageSentToday = (chats) => {
    if (chats.length === 0) {
      return 0;
    }

    // Get the latest chat date (assumed to be the last item)
    const latestChatDate = new Date(chats[chats.length - 1].date).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    // Compare the latest chat date with today's date
    return latestChatDate === today ? 1 : 0;
  };

  const createChat = async (userId) => {
    try {
      const response = await fetch('http://localhost:8000/chats/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error creating chat: ${errorText}`);
      }

      const newChat = await response.json();
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
    navigate('/home'); // Navigate to home page
  };

  const handleNextMessage = () => {
    const nextIndex = (currentBotMessageIndex + 1) % botMessages.length;
    setCurrentBotMessageIndex(nextIndex);
    setMessages([{ text: botMessages[nextIndex].text, sender: 'bot' }]);
  };

  const handlePrevMessage = () => {
    const prevIndex = (currentBotMessageIndex - 1 + botMessages.length) % botMessages.length;
    setCurrentBotMessageIndex(prevIndex);
    setMessages([{ text: botMessages[prevIndex].text, sender: 'bot' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);

    try {
      // Create a new chat and get the chat ID
      const newChat = await createChat(userId);
      const chatId = newChat.chat_id;

      // Post the message with the new chat ID
      const response = await fetch('http://localhost:8000/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: input,
          role: 'user',
          chat_id: chatId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error saving message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Message saved:', data);

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
            {message.sender === 'bot' && (
              <div className="navigation">
                <button onClick={handlePrevMessage} className="nav-button">
                  <MdArrowBackIos style={{ marginTop: '5px' }} />
                </button>
                <span>{`${currentBotMessageIndex + 1}/${botMessages.length}`}</span>
                <button onClick={handleNextMessage} className="nav-button">
                  <MdArrowForwardIos style={{ marginTop: '5px' }}/>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
      { !canSendMessage && 
          <div className="disabled-text-box">
            <div className="disabled-text">Thank you for reflecting with us today. Join us again tomorrow!</div>
          </div> 
        }
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your entry here"
          disabled={!canSendMessage}
          style={{ backgroundColor: !canSendMessage ? 'grey' : 'white' }} // Make input grey when disabled
        />
        <button type="submit" className="send-button" disabled={!canSendMessage}>
          <MdArrowForwardIos />
        </button>
      </form>
    </div>
  );
};

export default NewEntry;
