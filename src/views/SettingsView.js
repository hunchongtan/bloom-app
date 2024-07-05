import styles from "../styles/settings/Settings.module.css"

const SettingsView = () => {
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

export default SettingsView;