import React, { useEffect } from 'react';
import HomeNav from '../components/home/HomeNav';
import CalendarAlt from '../components/home/CalendarAlt';
import styles from '../styles/home/HomeAlt.module.css';

const HomeViewAlt = ({ setWeeklyMoodCounts }) => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');

    useEffect(() => {
        console.log(name, userId);
    }, [name, userId]);

    return (
        <div>
            <HomeNav />
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <CalendarAlt userId={userId} setWeeklyMoodCounts={setWeeklyMoodCounts} /> {/* Pass userId as prop */}
                </div>
            </div>
        </div>
    );
};

export default HomeViewAlt;
