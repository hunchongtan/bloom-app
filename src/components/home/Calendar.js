import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import styles from "../../styles/home/Calendar.module.css";

const Calendar = () => {
    const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Default to current month
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Default to current year
    const [currentDate, setCurrentDate] = useState(new Date().getDate()); // Default to current date

    useEffect(() => {
        fetch("http://worldtimeapi.org/api/ip")
            .then(response => response.json())
            .then(data => {
                const currentDate = new Date(data.datetime);
                setCurrentMonth(currentDate.getMonth());
                setCurrentYear(currentDate.getFullYear());
                setCurrentDate(currentDate.getDate());
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
            const isCurrentDate = day === currentDate && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
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
            if (prevMonth === 0) {
                setCurrentYear(prevYear => prevYear - 1);
                return 11; // December
            } else {
                return prevMonth - 1;
            }
        });
    };
    
    const handleNextMonth = () => {
        setCurrentMonth(prevMonth => {
            if (prevMonth === 11) {
                setCurrentYear(prevYear => prevYear + 1);
                return 0; // January
            } else {
                return prevMonth + 1;
            }
        });
    };

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <div className={styles.calendarHeader}>
                        <ArrowBackIosNew onClick={handlePrevMonth} />
                        <p style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "8px" }}>{`${months[currentMonth]} ${currentYear}`}</p>
                        <ArrowForwardIos onClick={handleNextMonth} />
                    </div>
                    <div className={styles.calendar}>
                        <div className={styles.calendarMonths}>
                            {daysOfWeek.map((day) => (
                                <div key={day} className={styles.calendarHeaderCell}>{day}</div>
                            ))}
                        </div>

                        <div className={styles.calendarBody}>
                            {renderCalendar()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;

