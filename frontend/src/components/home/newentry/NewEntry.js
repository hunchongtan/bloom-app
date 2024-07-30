import React, { useState, useEffect } from 'react';
import styles from '../../../styles/home/newentry/NewEntry.module.css';
import JournalsNav from "./JournalsNav";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import DateTimeHeader from './DateTimeHeader';
import botMessages from '../../../botMessages.json';

const NewEntry = () => {
  const [input, setInput] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const [promptMessages, setPromptMessages] = useState([]);
  const [currentBotMessageIndex, setCurrentBotMessageIndex] = useState(
    localStorage.getItem('currentBotMessageIndex') ? parseInt(localStorage.getItem('currentBotMessageIndex')) : 0
  );

  const userId = localStorage.getItem('userId');
  const today = new Date().toISOString().split('T')[0];

  const getPromptMessages = () => {
    const prompts = botMessages.find(message => message.date === today)?.prompts || [];
    return prompts.map(prompt => prompt.text) || ['No prompt available for today.'];
  };

  useEffect(() => {
    const initialize = async () => {
      console.log('Initializing...');
      const chats = await fetchChats(userId);
      console.log('Fetched chats:', chats);

      const todayChats = chats.filter(chat => new Date(chat.date).toISOString().split('T')[0] === today);
      const todayChat = todayChats.length > 0 ? todayChats[0] : undefined; // Use the first chat of the day
      console.log('Today\'s chat:', todayChat);

      const prompts = getPromptMessages();
      setPromptMessages(prompts);

      if (todayChat) {
        const chatMessages = await fetchMessages(todayChat.chat_id);
        console.log('Fetched today\'s messages:', chatMessages);

        const canSend = !checkIfMessageSentToday(chatMessages);
        console.log('Can send message today:', canSend);

        setCanSendMessage(canSend);
        setShowPopup(!canSend); // Show popup if a message has already been sent
      } else {
        setCanSendMessage(true);
      }
    };

    initialize();
  }, [userId, today]);

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

  const postPromptMessage = async (chatId, prompt) => {
    const payload = {
      content: prompt,
      role: 'Bloom',
      chat_id: chatId
    };

    try {
      const apiUrl = '/api';
      console.log('Posting prompt message:', payload);

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
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error('Invalid JSON response for posting prompt message');
      }
    } catch (error) {
      console.error('Error posting prompt message:', error);
      return prompt;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === '') return;

    console.log('User input:', input);

    try {
      const todayChat = await fetchChats(userId).then(chats => 
        chats.find(chat => new Date(chat.date).toISOString().split('T')[0] === today));

      const chatId = todayChat ? todayChat.chat_id : (await createChat(userId)).chat_id;

      if (!chatId) throw new Error('Failed to create or fetch chat ID');

      // Post the prompt message before posting the user's message
      await postPromptMessage(chatId, promptMessages[currentBotMessageIndex]);

      const payload = {
        content: input,
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

        // Post to LLM endpoint
        const llmPayload = {
          content: input,
          role: 'LLM',
          chat_id: chatId
        };

        await fetch(`${apiUrl}/langchain/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(llmPayload)
        });

        const chatMessages = await fetchMessages(chatId);
        const llmMessages = chatMessages.filter(message => message.role.toLowerCase() === 'llm');

        if (llmMessages.length > 0) {
          const llmMessage = llmMessages[llmMessages.length - 1];
          console.log('LLM message added:', llmMessage);
        }
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

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleNextMessage = () => {
    console.log('Handling next message');
    const nextIndex = (currentBotMessageIndex + 1) % promptMessages.length;
    setCurrentBotMessageIndex(nextIndex);
    localStorage.setItem('currentBotMessageIndex', nextIndex);
  };

  const handlePrevMessage = () => {
    console.log('Handling previous message');
    const prevIndex = (currentBotMessageIndex - 1 + promptMessages.length) % promptMessages.length;
    setCurrentBotMessageIndex(prevIndex);
    localStorage.setItem('currentBotMessageIndex', prevIndex);
  };

  return (
    <div>
      <JournalsNav />
      <div className={styles.content}>
        <div className={styles.transcContainer}>
          <DateTimeHeader />
          <div className={styles.botMessageContainer}>
            <h1>Your Daily Reflection</h1>
            <p>Here is your prompt for today: </p>
            <p>{promptMessages[currentBotMessageIndex]}</p>
            <div className={styles.navigation}>
              <button onClick={handlePrevMessage} className={styles.navButton} disabled={promptMessages.length <= 1}>
                <MdArrowBackIos style={{ marginTop: '5px' }} />
              </button>
              <span>{`${currentBotMessageIndex + 1}/${promptMessages.length}`}</span>
              <button onClick={handleNextMessage} className={styles.navButton} disabled={promptMessages.length <= 1}>
                <MdArrowForwardIos style={{ marginTop: '5px' }} />
              </button>
            </div>
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
          className={styles.inputFormInput}
          disabled={!canSendMessage}
        />
        <button type="submit" className={styles.inputFormButton} disabled={!canSendMessage}>
          <MdArrowForwardIos />
        </button>
      </form>
    </div>
  );
};

export default NewEntry;
