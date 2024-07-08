import styles from "../../styles/insights/InsightsNav.module.css";
import bloomIcon from "../../assets/bloomIcon.svg";

const InsightsNav = () => {
    return ( 
        <div className={styles.main}>
            <div className={styles.logoContainer}>
                <img src={bloomIcon} alt=""/>
                <h2 className={styles.homeText}>weekly insights</h2>
            </div>
        </div>
     );
}
 
export default InsightsNav;