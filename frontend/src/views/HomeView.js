import React, { useEffect } from 'react';
import HomeNav from '../components/home/HomeNav';
import Calendar from '../components/home/Calendar';
import styles from '../styles/home/Home.module.css';

const HomeView = ({ setWeeklyMoodCounts }) => {
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
                    <Calendar userId={userId} setWeeklyMoodCounts={setWeeklyMoodCounts} /> {/* Pass userId as prop */}
                </div>
            </div>
        </div>
    );
};

export default HomeView;
