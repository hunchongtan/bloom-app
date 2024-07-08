import React, { useEffect } from 'react';
import SettingsNav from '../components/settings/SettingsNav';
import SettingsPage from '../components/settings/SettingsPage';
import styles from '../styles/settings/Settings.module.css';

const SettingsView = () => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');

    useEffect(() => {
        console.log(name, userId);
    }, [name, userId]);

    return (
        <div>
            <SettingsNav />
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <SettingsPage name={name} userId={userId} /> {/* Pass userId as prop */}
                </div>
            </div>
        </div>
    );
};

export default SettingsView;