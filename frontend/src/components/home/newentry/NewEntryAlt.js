import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../../styles/home/newentry/NewEntryAlt.module.css';
import JournalsAltNav from "./JournalsAltNav";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import DateTimeHeader from './DateTimeHeader';
import botMessages from '../../../botMessages.json';

const NewEntryAlt = () => {
  const [input, setInput] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const [promptMessages, setPromptMessages] = useState([]);
  const [currentBotMessageIndex, setCurrentBotMessageIndex] = useState(
    localStorage.getItem('currentBotMessageIndex') ? parseInt(localStorage.getItem('currentBotMessageIndex')) : 0
  );
  const [messages, setMessages] = useState([]);
  const [todayChat, setTodayChat] = useState(null);

  const userId = localStorage.getItem('userId');
  const today = new Date().toISOString().split('T')[0];

  const getPromptMessages = useCallback(() => {
    const prompts = botMessages.find(message => message.date === today)?.prompts || [];
    return prompts.map(prompt => prompt.text) || ['No prompt available for today.'];
  }, [today]);

  useEffect(() => {
    const initialize = async () => {
      const chats = await fetchChats(userId);

      const todayChats = chats.filter(chat => new Date(chat.date).toISOString().split('T')[0] === today);
      const todayChat = todayChats.length > 0 ? todayChats[0] : undefined;

      setTodayChat(todayChat);

      const prompts = getPromptMessages();
      setPromptMessages(prompts);

      if (todayChat) {
        const chatMessages = await fetchMessages(todayChat.chat_id);
        const canSend = !checkIfMessageSentToday(chatMessages);
        setCanSendMessage(canSend);
        setShowPopup(!canSend); // Show popup if a message has already been sent

        const userMessages = chatMessages.filter(message => message.role.toLowerCase() === 'user');
        const fetchedMessages = userMessages.map(message => ({ text: message.content, sender: 'user', date: message.date }));

        setMessages(fetchedMessages); // Only setting user messages without the prompt
      } else {
        setCanSendMessage(true);
      }
    };

    initialize();
  }, [userId, today, currentBotMessageIndex, getPromptMessages]);

  const fetchChats = async (userId) => {
    try {
      const apiUrl = '/api';
      const response = await fetch(`${apiUrl}/chats/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        return data || [];
      } else {
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
      const response = await fetch(`${apiUrl}/messages/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const messages = await response.json();
        return messages || [];
      } else {
        throw new Error('Invalid JSON response for messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const postPromptMessage = async (chatId, prompt) => {
    const payload = {
      content: prompt,
      role: 'Bloom',
      chat_id: chatId
    };

    try {
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
        return prompt;
      } else {
        throw new Error('Invalid JSON response for posting prompt message');
      }
    } catch (error) {
      console.error('Error posting prompt message:', error);
      return prompt;
    }
  };

  const checkIfMessageSentToday = (messages) => {
    return messages.some(message => message.role.toLowerCase() === 'user');
  };

  const createChat = async (userId) => {
    try {
      const apiUrl = '/api';
      const payload = { user_id: userId };
      const response = await fetch(`${apiUrl}/chats/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const newChat = await response.json();
        return newChat;
      } else {
        throw new Error('Invalid JSON response for creating chat');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === '') return;

    try {
      const todayChat = await fetchChats(userId).then(chats => 
        chats.find(chat => new Date(chat.date).toISOString().split('T')[0] === today));

      const chatId = todayChat ? todayChat.chat_id : (await createChat(userId)).chat_id;

      if (!chatId) throw new Error('Failed to create or fetch chat ID');

      await postPromptMessage(chatId, promptMessages[currentBotMessageIndex]);

      const payload = {
        content: input,
        role: 'User',
        chat_id: chatId
      };

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
        setCanSendMessage(false);
        setShowPopup(true);

        setMessages(prevMessages => [...prevMessages, { text: input, sender: 'user' }]);
      } else {
        throw new Error('Invalid JSON response for saving message');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleNextMessage = () => {
    const nextIndex = (currentBotMessageIndex + 1) % promptMessages.length;
    setCurrentBotMessageIndex(nextIndex);
    localStorage.setItem('currentBotMessageIndex', nextIndex);
  };

  const handlePrevMessage = () => {
    const prevIndex = (currentBotMessageIndex - 1 + promptMessages.length) % promptMessages.length;
    setCurrentBotMessageIndex(prevIndex);
    localStorage.setItem('currentBotMessageIndex', prevIndex);
  };

  return (
    <div>
      <div className={styles.content}>
        <JournalsAltNav />
        <div className={styles.newEntryInputForm}>
          <DateTimeHeader />
          <div className={styles.botMessageContainer}>
            <h1>Your Daily Reflection</h1>
            {!todayChat || canSendMessage ? (
              <p>Here is your prompt for today: <br /> {promptMessages[currentBotMessageIndex]}</p>
            ) : null}
            <div className={styles.navigation}>
              <button onClick={handlePrevMessage} className={styles.navButton} disabled={promptMessages.length <= 1 || !canSendMessage}>
                <MdArrowBackIos style={{ marginTop: '5px' }} />
              </button>
              <span>{`${currentBotMessageIndex + 1}/${promptMessages.length}`}</span>
              <button onClick={handleNextMessage} className={styles.navButton} disabled={promptMessages.length <= 1 || !canSendMessage}>
                <MdArrowForwardIos style={{ marginTop: '5px' }} />
              </button>
            </div>
          </div>

          {showPopup && (
            <div className={styles.popup}>
              <div className={styles.disabledText}>
                Thank you for reflecting with us today. Join us again tomorrow!
              </div>
              <button className={styles.closeButton} onClick={closePopup}>X</button>
            </div>
          )}

          {!showPopup && canSendMessage && (
            <textarea
              className={styles.noteInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Start writing..."
              disabled={!canSendMessage}
            />
          )}

          <div className={styles.messagesContainer}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${message.sender === 'user' ? styles.messageUser : ''}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {!showPopup && canSendMessage && (
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!canSendMessage}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewEntryAlt;
