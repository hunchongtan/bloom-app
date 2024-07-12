import React, { useState, useEffect } from 'react';
import styles from '../../../styles/home/newentry/NewEntry.module.css';
import JournalsNav from "./JournalsNav";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import DateTimeHeader from './DateTimeHeader';
import botMessages from '../../../botMessages.json';

const NewEntry = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentBotMessageIndex, setCurrentBotMessageIndex] = useState(0);
  const [canSendMessage, setCanSendMessage] = useState(false); // Initially, buttons are disabled
  const [showPopup, setShowPopup] = useState(false);

  const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

  useEffect(() => {
    const initialize = async () => {
      setMessages([{ text: botMessages[0].text, sender: 'bot' }]);

      const chats = await fetchChats(userId);
      console.log('Fetched chats:', chats);

      const today = new Date().toISOString().split('T')[0];
      const todayChat = chats.find(chat => new Date(chat.date).toISOString().split('T')[0] === today);

      if (todayChat) {
        console.log('Found today\'s chat:', todayChat);
        const chatMessages = await fetchMessages(todayChat.chat_id);
        console.log('Fetched today\'s messages:', chatMessages);

        const canSend = checkIfMessageSentToday(chatMessages);
        console.log('checkIfMessageSentToday:', canSend);

        if (!canSend) {
          setCanSendMessage(true); // Enable buttons if no messages are sent today
        }

        const userMessages = chatMessages.filter(message => message.role.toLowerCase() === 'user');
        const llmMessages = chatMessages.filter(message => message.role.toLowerCase() === 'llm');

        const uniqueUserMessages = userMessages.length > 0 ? [userMessages[0]] : [];
        const fetchedMessages = [
          ...uniqueUserMessages.map(message => ({ text: message.content, sender: 'user', date: message.date })),
          ...llmMessages.map(message => ({ text: message.content, sender: 'llm', date: message.date }))
        ];
        
        setMessages([{ text: botMessages[0].text, sender: 'bot' }, ...fetchedMessages]);

        if (canSendMessage) {
          setShowPopup(false); // Hide popup if messages can be sent
        } else {
          setShowPopup(true); // Show popup if messages cannot be sent
        }
      } else {
        console.log('No chat found for today.');
        setCanSendMessage(true); // Enable buttons if no chat for today
      }
    };

    initialize();
  }, [userId]);

  const fetchChats = async (userId) => {
    try {
      console.log(`Fetching chats for user ID: ${userId}`);
      const response = await fetch(`/chats/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const data = await response.json();
      console.log('Fetched chats data:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      console.log(`Fetching messages for chat ID: ${chatId}`);
      const response = await fetch(`/messages/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages for chat ID ${chatId}`);
      }

      const messages = await response.json();
      console.log('Fetched messages data:', messages);
      return messages || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const checkIfMessageSentToday = (messages) => {
    console.log('Checking if message sent today with messages:', messages);
    if (messages.length > 0) {
      return true;
    }
    return false;
  };

  const createChat = async (userId) => {
    try {
      console.log(`Creating chat for user ID: ${userId}`);
      const response = await fetch('/chats/', {
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
      console.log('Created chat:', newChat);
      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  const handleNextMessage = () => {
    if (canSendMessage) {
      const nextIndex = (currentBotMessageIndex + 1) % botMessages.length;
      setCurrentBotMessageIndex(nextIndex);
      setMessages([{ text: botMessages[nextIndex].text, sender: 'bot' }]);
    }
  };

  const handlePrevMessage = () => {
    if (canSendMessage) {
      const prevIndex = (currentBotMessageIndex - 1 + botMessages.length) % botMessages.length;
      setCurrentBotMessageIndex(prevIndex);
      setMessages([{ text: botMessages[prevIndex].text, sender: 'bot' }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    console.log('User message added:', userMessage);

    try {
      // Create a new chat and get the chat ID
      const newChat = await createChat(userId);
      if (!newChat || !newChat.chat_id) {
        throw new Error('Failed to create chat or get chat ID');
      }

      const chatId = newChat.chat_id;

      // Log the payload being sent to the server
      const payload = {
        content: input,
        role: 'User',
        chat_id: chatId
      };
      console.log('Payload being sent:', payload);

      // Post the message with the new chat ID
      const response = await fetch('/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error saving message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Message saved:', data);

      // Disable buttons after sending message
      setCanSendMessage(false);
      setShowPopup(true); // Show popup after sending message

      // Send the user message to langchain
      await fetch('/langchain/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: input, role: 'LLM', chat_id: chatId })
      });
      console.log('Sent user message to Langchain');

      // Fetch the LLM reply
      const chatMessages = await fetchMessages(chatId);
      const llmMessages = chatMessages.filter(message => message.role === 'LLM');

      if (llmMessages.length > 0) {
        const llmMessage = llmMessages[llmMessages.length - 1];
        setMessages(prevMessages => [...prevMessages, { text: llmMessage.content, sender: 'llm' }]);
        console.log('LLM message added:', llmMessage);
      }

    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
  };

  return (
    <div>
      <JournalsNav />
      <div className={styles.content}>
        <div className={styles.transcContainer}>
          <DateTimeHeader />
          <div className={styles.chatWindow}>
            {messages.map((message, index) => (
              <div key={index} className={`${styles.message} ${message.sender === 'bot' || message.sender === 'llm' ? styles.messageBot : styles.messageUser}`}>
                {message.text}
                {message.sender === 'bot' && (
                  <div className={styles.navigation}>
                    <button onClick={handlePrevMessage} className={styles.navButton} disabled={!canSendMessage}>
                      <MdArrowBackIos style={{ marginTop: '5px' }} />
                    </button>
                    <span>{`${currentBotMessageIndex + 1}/${botMessages.length}`}</span>
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
            <button className={styles.closeButton} onClick={() => setShowPopup(false)}>X</button>
          </div>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your entry here"
          disabled={!canSendMessage}
          className={styles.inputFormInput}
          style={{ backgroundColor: !canSendMessage ? 'grey' : 'white' }} // Make input grey when disabled
        />
        <button type="submit" className={styles.inputFormButton} disabled={!canSendMessage}>
          <MdArrowForwardIos />
        </button>
      </form>
    </div>
  );
};

export default NewEntry;
