import React, { useState } from 'react';
import styles from '../../styles/settings/SettingsPage.module.css';

const SettingsPage = ({ userId }) => {
    const name = localStorage.getItem('name'); // Retrieve the user's name from localStorage
    const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=150');

    const handleLogout = () => {
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        localStorage.removeItem('profileImage');
        window.location.replace('/');
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => {
            setProfileImage(reader.result);
            localStorage.setItem('profileImage', reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.settingsPage}>
            <div className={styles.profileContainer}>
                <img 
                    src={profileImage}
                    alt="User Profile" 
                    className={styles.profileImage} 
                />
                <label className={styles.uploadButton}>
                    Upload profile picture
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} // Hide the default file input
                    />
                </label>
                <h2 className={styles.username}>{name}</h2>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default SettingsPage;
