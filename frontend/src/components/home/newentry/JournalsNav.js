import React from 'react';
import { MdArrowBackIos } from "react-icons/md";
import styles from "../../../styles/home/newentry/JournalsNav.module.css";
import bloomIcon from "../../../assets/bloomIcon.svg";
import { useNavigate } from 'react-router-dom';

const JournalsNav = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        console.log("Back button clicked");
        navigate('/homeAlt'); // Navigate to home page
    };

    return (
        <div className={styles.navContainer}>
            <MdArrowBackIos className={styles.backButton} onClick={handleBackClick} />
            <div className={styles.main}>
                <div className={styles.logoContainer}>
                    <img src={bloomIcon} alt="bloom logo" className={styles.logoImage}/>
                    <h2 className={styles.homeText}>journals</h2>
                </div>
            </div>
        </div>
    );
}

export default JournalsNav;
