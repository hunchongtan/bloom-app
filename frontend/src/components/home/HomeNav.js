import styles from "../../styles/home/HomeNav.module.css";
import bloomIcon from "../../assets/bloomIcon.svg";

const HomeNav = () => {
    return ( 
        <div className={styles.main}>
            <div className={styles.logoContainer}>
                <img src={bloomIcon} alt=""/>
                <h2 className={styles.homeText}>home</h2>
            </div>
        </div>
     );
}
 
export default HomeNav;