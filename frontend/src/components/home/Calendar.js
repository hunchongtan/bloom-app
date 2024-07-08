import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import styles from "../../styles/home/Calendar.module.css";

const Calendar = () => {
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Default to current month
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Default to current year

    useEffect(() => {
        fetch("http://worldtimeapi.org/api/ip")
            .then(response => response.json())
            .then(data => {
                const currentDate = new Date(data.datetime);
                setCurrentMonth(currentDate.getMonth());
                setCurrentYear(currentDate.getFullYear());
            })
            .catch(error => {
                console.error("Error fetching current date:", error);
            });
    }, []);

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
        const calendarDays = [];

        // Add empty cells for the days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty${i}`} className={styles.calendarCell}></div>);
        }

        // Add cells for each day in the month with a link to /entry
        for (let day = 1; day <= daysInMonth; day++) {
            const isCurrentDate = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
            const cellClass = isCurrentDate ? `${styles.calendarCell} ${styles.currentDate}` : styles.calendarCell;
            calendarDays.push(
                <Link to="/entry" key={day} className={cellClass}>
                    {day}
                </Link>
            );
        }

        return calendarDays;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prevMonth => {
            let newMonth = prevMonth - 1;
            let newYear = currentYear;
            if (newMonth < 0) {
                newMonth = 11; // December
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
                newMonth = 0; // January
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
                    <Link to="/new-entry" className={styles.startNewEntryButton}>
                        🌱 Start new entry
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Calendar;