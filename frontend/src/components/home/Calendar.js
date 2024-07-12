import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBackIosNew, ArrowForwardIos, FilterVintage } from '@mui/icons-material';
import styles from '../../styles/home/Calendar.module.css';

const Calendar = ({ userId, setWeeklyMoodCounts }) => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [entries, setEntries] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigate = useNavigate();

    const calculateWeeklyMoodCounts = useCallback((entries) => {
        const weeks = {};

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - 6); // Past 7 days

        weeks['currentWeek'] = { Passion: 0, Courage: 0, Melancholy: 0, Resilience: 0, Joy: 0 };

        entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            if (entryDate >= startOfWeek && entryDate <= today) {
                switch (entry.mood) {
                    case 'anger':
                        weeks['currentWeek'].Passion++;
                        break;
                    case 'fear':
                        weeks['currentWeek'].Courage++;
                        break;
                    case 'sadness':
                        weeks['currentWeek'].Melancholy++;
                        break;
                    case 'anticipation':
                        weeks['currentWeek'].Resilience++;
                        break;
                    case 'joy':
                        weeks['currentWeek'].Joy++;
                        break;
                    default:
                        break;
                }
            }
        });

        console.log('Weekly mood counts:', weeks);
        setWeeklyMoodCounts([weeks['currentWeek']]);
    }, [setWeeklyMoodCounts]);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const user_id = localStorage.getItem('userId'); // Retrieve user ID from localStorage
                console.log('Retrieved user ID:', user_id); // Log the user ID

                const response = await fetch(`/chats/${user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                console.log('Retrieved JSON data:', data); // Log the retrieved JSON data

                setEntries(data);
                calculateWeeklyMoodCounts(data);
            } catch (error) {
                console.error('Error fetching entries:', error);
            }
        };

        if (userId) {
            fetchEntries();
        }

        const fetchDate = async () => {
            try {
                const response = await fetch('http://worldtimeapi.org/api/ip');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const currentDate = new Date(data.datetime);
                setCurrentMonth(currentDate.getMonth());
                setCurrentYear(currentDate.getFullYear());
                setCurrentDate(currentDate);
            } catch (error) {
                console.error('Error fetching current date:', error);
            }
        };

        fetchDate();
    }, [userId, calculateWeeklyMoodCounts]);

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const handleCellClick = (date, isCurrentDate, hasEntry) => {
        if (isCurrentDate) {
            navigate('/entry/new');
        } else if (hasEntry) {
            navigate(`/entry/${date}`);
        }
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
        const calendarDays = [];

        const today = new Date();
        const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty${i}`} className={styles.calendarCell}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isPastDate = new Date(currentYear, currentMonth, day) < today;
            const isCurrentDate = isCurrentMonth && day === today.getDate();
            const hasEntry = entries.some(entry => entry.date === date && entry.mood !== 'neutral');
            const entry = entries.find(entry => entry.date === date && entry.mood !== 'neutral');
            const cellClass = isCurrentDate ? `${styles.calendarCell} ${styles.currentDate}` : styles.calendarCell;
            const entryClass = hasEntry ? `${cellClass} ${styles.hasEntry}` : cellClass;
            const moodClass = entry ? styles[entry.mood.toLowerCase()] : '';
            const textColor = isPastDate ? styles.pastDate : styles.futureDate;

            calendarDays.push(
                <div
                    key={day}
                    className={`${entryClass} ${moodClass} ${textColor}`}
                    onClick={() => handleCellClick(date, isCurrentDate, hasEntry)}
                    style={(hasEntry || isCurrentDate) ? { cursor: 'pointer' } : {}}
                >
                    {hasEntry ? <FilterVintage className={`${styles.entryIcon} ${moodClass}`} /> : day}
                </div>
            );
        }

        return calendarDays;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => {
            let newMonth = prevMonth - 1;
            let newYear = currentYear;
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }
            setCurrentYear(newYear);
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => {
            let newMonth = prevMonth + 1;
            let newYear = currentYear;
            if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            setCurrentYear(newYear);
            return newMonth;
        });
    };

    const resetToCurrentMonth = () => {
        const currentDate = new Date();
        setCurrentMonth(currentDate.getMonth());
        setCurrentYear(currentDate.getFullYear());
    };

    const hasEntryToday = entries.some(entry => entry.date === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}` && entry.mood !== 'neutral');
    const isCurrentMonth = currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <div className={styles.calendarHeader}>
                        <ArrowBackIosNew onClick={handlePrevMonth} />
                        <p onClick={resetToCurrentMonth} style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "8px", cursor: "pointer" }}>{`${months[currentMonth]} ${currentYear}`}</p>
                        <ArrowForwardIos onClick={handleNextMonth} />
                    </div>
                    <div className={styles.calendar}>
                        <div className={styles.calendarMonths}>
                            {daysOfWeek.map((day, index) => (
                                <div key={index} className={styles.calendarHeaderCell}>{day}</div>
                            ))}
                        </div>

                        <div className={styles.calendarBody}>
                            {renderCalendar()}
                        </div>
                    </div>
                    <div className={styles.entryButtonContainer}>
                        {isCurrentMonth && (
                            hasEntryToday ? (
                                <div className={styles.disabledEntryButton} disabled>
                                    🔥 Check back tomorrow
                                </div>
                            ) : (
                                <Link to="/entry/new" className={styles.startNewEntryButton}>
                                    🌱 Start new entry
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
