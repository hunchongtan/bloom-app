// src/components/DateTimeHeader.js
import React, { useEffect, useState } from 'react';

const DateTimeHeader = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };


  return (
    <div className="dateTimeHeader">
      <div className="date">{formatDate(dateTime)}</div>
    </div>
  );
};

export default DateTimeHeader;
