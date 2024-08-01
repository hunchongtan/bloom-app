import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../../styles/home/newentry/NewEntryAlt.module.css';
import JournalsNav from "./JournalsNav";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import DateTimeHeader from './DateTimeHeader';
import botMessages from '../../../botMessages.json';

const NewEntry = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentBotMessageIndex, setCurrentBotMessageIndex] = useState(localStorage.getItem('currentBotMessageIndex') ? parseInt(localStorage.getItem('currentBotMessageIndex')) : 0);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [chatCreated, setChatCreated] = useState(false);

  const userId = localStorage.getItem('userId');
  const today = new Date().toISOString().split('T')[0];

  const getPromptMessage = useCallback(() => {
    const prompts = fetchPrompt(today);
    return prompts[currentBotMessageIndex].text;
  }, [currentBotMessageIndex, today]);

  useEffect(() => {
    const initialize = async () => {
      console.log('Initializing...');
      const chats = await fetchChats(userId);
      console.log('Fetched chats:', chats);

      const todayChats = chats.filter(chat => new Date(chat.date).toISOString().split('T')[0] === today);
      const todayChat = todayChats.length > 0 ? todayChats[0] : undefined;
      console.log('Today\'s chat:', todayChat);

      if (todayChat) {
        const chatMessages = await fetchMessages(todayChat.chat_id);
        console.log('Fetched today\'s messages:', chatMessages);

        const canSend = checkIfMessageSentToday(chatMessages);
        console.log('Can send message today:', canSend);

        setCanSendMessage(!canSend);

        const userMessages = chatMessages.filter(message => message.role.toLowerCase() === 'user');

        const fetchedMessages = [
          ...userMessages.map(message => ({ text: message.content, sender: 'user', date: message.date }))
        ];

        const prompt = getPromptMessage();
        setMessages([{ text: prompt, sender: 'bot' }, ...fetchedMessages]);

        if (!canSend && fetchedMessages.length >= 1) {
          console.log('Setting showPopup to true during initialization');
          setShowPopup(true);
        }
      } else {
        if (!chatCreated) {
          console.log('No chat found for today. Creating a new chat...');
          const newChat = await createChat(userId);
          if (newChat) {
            const prompt = getPromptMessage();
            setMessages([{ text: prompt, sender: 'bot' }]);
            setChatCreated(true);
          }
        }
        setCanSendMessage(true);
      }
    };

    initialize();
  }, [userId, today, currentBotMessageIndex, getPromptMessage, chatCreated]);

  const fetchChats = async (userId) => {
    try {
      const apiUrl = '/api';
      console.log(`Fetching chats for user ID: ${userId} using API URL: ${apiUrl}`);

      const response = await fetch(`${apiUrl}/chats/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        console.log('Fetched chats data:', data);
        return data || [];
      } else {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Invalid JSON response for chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const apiUrl = '/api';
      console.log(`Fetching messages for chat ID: ${chatId} using API URL: ${apiUrl}`);

      const response = await fetch(`${apiUrl}/messages/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const messages = await response.json();
        console.log('Fetched messages data:', messages);
        return messages || [];
      } else {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Invalid JSON response for messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const fetchPrompt = (date) => {
    const botMessage = botMessages.find(message => message.date === date);
    return botMessage ? botMessage.prompts : [];
  };

  const checkIfMessageSentToday = (messages) => {
    console.log('Checking if message sent today with messages:', messages);
    return messages.some(message => message.role.toLowerCase() === 'user');
  };

  const createChat = async (userId) => {
    try {
      const apiUrl = '/api';
      const payload = { user_id: userId };
      console.log('Creating chat with payload:', payload);

      const response = await fetch(`${apiUrl}/chats/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const newChat = await response.json();
        console.log('Created chat:', newChat);
        return newChat;
      } else {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Invalid JSON response for creating chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const handleNextMessage = () => {
    console.log('Handling next message');
    const nextIndex = (currentBotMessageIndex + 1) % 3;
    setCurrentBotMessageIndex(nextIndex);
    localStorage.setItem('currentBotMessageIndex', nextIndex);

    const prompt = getPromptMessage();
    setMessages([{ text: prompt, sender: 'bot' }]);
    setShowPopup(false);
  };

  const handlePrevMessage = () => {
    console.log('Handling previous message');
    const prevIndex = (currentBotMessageIndex - 1 + 3) % 3;
    setCurrentBotMessageIndex(prevIndex);
    localStorage.setItem('currentBotMessageIndex', prevIndex);

    const prompt = getPromptMessage();
    setMessages([{ text: prompt, sender: 'bot' }]);
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (input.trim() === '') return;
  
    const taggedInput = `${input} [Chatbot]`; // Append [Chatbot] tag here
    const userMessage = { text: input, sender: 'user' }; // Keep the input without tag for display
    setMessages([...messages, userMessage]);
    console.log('User message added:', userMessage);
  
    try {
      const todayChat = await fetchChats(userId).then(chats => 
        chats.find(chat => new Date(chat.date).toISOString().split('T')[0] === today));
  
      const chatId = todayChat ? todayChat.chat_id : (await createChat(userId)).chat_id;
  
      if (!chatId) throw new Error('Failed to create or fetch chat ID');
  
      const payload = {
        content: taggedInput, // Append [Chatbot] tag here
        role: 'User',
        chat_id: chatId
      };
      console.log('Payload being sent:', payload);
  
      const apiUrl = '/api';
      const response = await fetch(`${apiUrl}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        await response.json();
        console.log('Message saved:', payload);
  
        setCanSendMessage(false);
        setShowPopup(true);
      } else {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Invalid JSON response for saving message');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    setInput('');
  };
  
  const stripTag = (text) => {
    return text.replace(' [Chatbot]', '');
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <JournalsNav />
      <div className={styles.content}>
        <div className={styles.transcContainer}>
          <DateTimeHeader />
          <div className={styles.chatWindow}>
            {messages.map((message, index) => (
              <div key={index} className={`${styles.message} ${message.sender === 'bot' ? styles.messageBot : styles.messageUser}`}>
                {stripTag(message.text)}
                {message.sender === 'bot' && (
                  <div className={styles.navigation}>
                    <button onClick={handlePrevMessage} className={styles.navButton} disabled={!canSendMessage}>
                      <MdArrowBackIos style={{ marginTop: '5px' }} />
                    </button>
                    <span>{`${currentBotMessageIndex + 1}/3`}</span>
                    <button onClick={handleNextMessage} className={styles.navButton} disabled={!canSendMessage}>
                      <MdArrowForwardIos style={{ marginTop: '5px' }} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        {showPopup && (
          <div className={styles.popup}>
            <div className={styles.disabledText}>
              Thank you for reflecting with us today. Join us again tomorrow!
            </div>
            <button className={styles.closeButton} onClick={closePopup}>X</button>
          </div>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your entry here"
          disabled={!canSendMessage}
          className={styles.inputFormInput}
          style={{ backgroundColor: !canSendMessage ? 'grey' : 'white' }}
        />
        <button type="submit" className={styles.inputFormButton} disabled={!canSendMessage}>
          <MdArrowForwardIos />
        </button>
      </form>
    </div>
  );
};

export default NewEntryAlt;