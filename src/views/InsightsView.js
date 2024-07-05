import styles from "../styles/insights/Insights.module.css"

const InsightsView = () => {
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

export default InsightsView;