import HomeNav from "../components/home/HomeNav";
import Calendar from "../components/home/Calendar";
import styles from "../styles/home/Home.module.css"

const HomeView = () => {
    return (
        <div>
            <HomeNav />
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <Calendar />
                </div>
            </div>
        </div>
    );
}

export default HomeView;