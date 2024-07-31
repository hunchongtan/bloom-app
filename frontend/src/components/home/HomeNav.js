import styles from "../../styles/home/HomeNav.module.css";
import bloomIcon from "../../assets/bloomIcon.svg";
import { useNavigate, useLocation } from 'react-router-dom';

const HomeNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogoClick = () => {
        if (location.pathname === "/home") {
            navigate("/homeAlt");
        } else {
            navigate("/home");
        }
    };

    return ( 
        <div className={styles.main}>
            <div className={styles.logoContainer}>
                <img src={bloomIcon} alt="Bloom Icon" onClick={handleLogoClick}/>
                <h2 className={styles.homeText}>home</h2>
            </div>
        </div>
     );
}

export default HomeNav;
