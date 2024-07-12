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
        // Fetch chats to get chat_id and mood
        const chatsResponse = await fetch(`/chats/${userId}`);
        const chats = await chatsResponse.json();
        const chat = chats.find(chat => new Date(chat.date).toISOString().split('T')[0] === date);

        if (chat) {
          const chatId = chat.chat_id;
          
          // Fetch prompt
          const promptResponse = await fetch(`/prompt/${chatId}`);
          const promptData = await promptResponse.json();
          const promptContent = promptData.content;

          // Fetch messages
          const messagesResponse = await fetch(`/messages/${chatId}`);
          const messages = await messagesResponse.json();
          const userMessage = messages.find(message => message.role === 'User').content;
          const llmMessage = messages.find(message => message.role === 'LLM').content;

          setEntry({
            date: chat.date,
            mood: chat.mood,
            prompt: promptContent,
            userMessage: userMessage,
            llmMessage: llmMessage
          });
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
          <h2>{new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
          <p className={styles.feeling}>Feeling: {entry.mood}</p>
          <h3>{entry.prompt}</h3>
          <p>{entry.userMessage}</p>
          <p>{entry.llmMessage}</p>
        </div>
      </div>
    </div>
  );
}

export default EntryView;
