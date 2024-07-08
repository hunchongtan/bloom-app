import styles from "../../styles/settings/SettingsNav.module.css";
import bloomIcon from "../../assets/bloomIcon.svg";

const SettingsNav = () => {
    return ( 
        <div className={styles.main}>
            <div className={styles.logoContainer}>
                <img src={bloomIcon} alt=""/>
                <h2 className={styles.homeText}>portfolio</h2>
            </div>
        </div>
     );
}
 
export default SettingsNav;