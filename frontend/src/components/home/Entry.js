import styles from "../../styles/home/Entry.module.css";

const Entry = () => {
    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <p style={{fontSize: "0.8rem", fontWeight: "bold", marginBottom: "8px"}}>HELLO WORLD!</p>
                </div>
            </div>
        </div>
    );
}

export default Entry;