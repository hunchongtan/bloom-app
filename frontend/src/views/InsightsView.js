import InsightsNav from "../components/insights/InsightsNav";
import InsightsPage from "../components/insights/InsightsPage";
import styles from "../styles/insights/Insights.module.css";

const InsightsView = ({ weeklyMoodCounts }) => {
    return (
        <div>
            <InsightsNav />
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <InsightsPage weeklyMoodCounts={weeklyMoodCounts} />
                </div>
            </div>
        </div>
    );
}

export default InsightsView;
