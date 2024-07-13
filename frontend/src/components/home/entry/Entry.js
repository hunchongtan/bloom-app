import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EntryNav from "./EntryNav";
import styles from "../../../styles/home/entry/Entry.module.css";

const EntryView = () => {
  const { date } = useParams(); // Get the date from the URL parameters
  const [entry, setEntry] = useState({});
  const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        console.log(`Fetching entry for user ID: ${userId} and date: ${date}`);

        const apiUrl = '/api'; // Use the proxy path
        console.log(`Using API URL: ${apiUrl}`);

        // Fetch chats to get chat_id and mood
        let response = await fetch(`${apiUrl}/chats/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
          const chats = await response.json();
          const chat = chats.find(chat => new Date(chat.date).toISOString().split('T')[0] === date);

          if (chat) {
            const chatId = chat.chat_id;

            // Fetch prompt
            response = await fetch(`${apiUrl}/prompt/${chatId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error response text:', errorText);
              throw new Error('Invalid JSON response for prompt');
            }

            const promptData = await response.json();
            const promptContent = promptData.content;

            // Fetch messages
            response = await fetch(`${apiUrl}/messages/${chatId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error response text:', errorText);
              throw new Error('Invalid JSON response for messages');
            }

            const messages = await response.json();
            const userMessage = messages.find(message => message.role === 'User').content;
            const llmMessage = messages.find(message => message.role === 'LLM').content;

            setEntry({
              date: chat.date,
              mood: chat.mood,
              prompt: promptContent,
              userMessage: userMessage,
              llmMessage: llmMessage
            });

            console.log('Entry data:', {
              date: chat.date,
              mood: chat.mood,
              prompt: promptContent,
              userMessage: userMessage,
              llmMessage: llmMessage
            });
          } else {
            console.log('No chat found for the specified date.');
          }
        } else {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error('Invalid JSON response for chats');
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
      }
    };

    fetchEntry();
  }, [userId, date]);

  return (
    <div>
      <EntryNav />
      <div className={styles.content}>
        <div className={styles.transcContainer}>
          <h2>{entry.date && new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
          <p className={styles.feeling}>Feeling: {entry.mood}</p>
          <h3>{entry.prompt}</h3>
          <p>{entry.userMessage}</p>
          <p>{entry.llmMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default EntryView;
