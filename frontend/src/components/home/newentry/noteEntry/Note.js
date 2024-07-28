import React, { useState, useEffect } from 'react';
import '../../../../styles/home/newentry/noteEntry/Note.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import JournalsNav from "../JournalsNav";

function Note() {
  const [note, setNote] = useState('');
  const [showSaved, setShowSaved] = useState(false);
  const [date, setDate] = useState(() => {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveClick = () => {
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 2000);  // The feedback bubble will disappear after 2 seconds
  };

  return (
    <div>
        <JournalsNav />
            <div className="content">
                <div className="note-app">
                    <header className="app-header">
                    <span className="time">{date}</span>
                    <div className="title-container">
                        <h2 className="title">Prompt from Bloom</h2>
                        <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="save-icon"
                        onClick={handleSaveClick}
                        />
                    </div>
                    </header>
                    <textarea
                    className="note-input"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Start writing..."
                    />
                    {showSaved && <div className="popup">Entry has been saved</div>}
                </div>
            </div>
    </div>
  );
}

export default Note;
