import styles from "../../../styles/newentry/JournalsNav.module.css";
import bloomIcon from "../../../assets/bloomIcon.svg";

const JournalsNav = () => {
    return ( 
        <div className={styles.main}>
            <div className={styles.logoContainer}>
                <img src={bloomIcon} alt="" className={styles.logo}/>
                <h2 className={styles.homeText}>journals</h2>
            </div>
        </div>
     );
}
 
export default JournalsNav;