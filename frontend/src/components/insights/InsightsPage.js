import styles from "../../styles/insights/InsightsPage.module.css";
import sunflower from '../../assets/sunflower.png';
import lavender from '../../assets/lavender.png';
import rose from '../../assets/rose.png';
import orchid from '../../assets/orchid.png';
import bluebell from '../../assets/bluebell.png';
import seedling from '../../assets/seedling.png';

const flowerImages = {
    Sunflower: sunflower,
    Lavender: lavender,
    Rose: rose,
    Orchid: orchid,
    Bluebell: bluebell,
    Seedling: seedling
};

const InsightsPageView = ({ mood }) => {
    const getMoodContent = (mood) => {
        switch(mood) {
            case 'Joy':
                return {
                    flower: 'Sunflower',
                    writeup: `This week, your journaling radiates with the warmth and positivity of a sunflower. Like a sunflower turning towards the sun, you have embraced the bright side of life, spreading joy and positivity wherever you go.

Sunflowers are symbols of adoration and loyalty, much like your unwavering commitment to finding happiness in the little things. Your joyful spirit is infectious, lighting up the lives of those around you.

Your Mood: A Sunflower in Full Bloom

Just as sunflowers reach for the sky, your entries reflect an upward, positive outlook. Your joy and enthusiasm are truly inspiring, reminding us all that with a little sunshine, we can all grow and thrive.`
                };
            case 'Serenity':
                return {
                    flower: 'Lavender',
                    writeup: `This week, your journaling exudes the calm and tranquility of lavender. Like the soothing scent of lavender fields, you have found a peaceful balance in the midst of life's chaos, bringing a sense of calm and relaxation to your surroundings.

Lavender is known for its calming properties, much like your ability to stay composed and serene even in challenging times. Your peaceful nature is a beacon of tranquility for those around you.

Your Mood: A Lavender in Bloom

Just as lavender soothes the soul, your entries reflect a serene and balanced state of mind. Your calm and peaceful demeanor is truly inspiring, reminding us all that tranquility can be found even in the most turbulent times.`
                };
            case 'Passion':
                return {
                    flower: 'Rose',
                    writeup: `This week, your journaling is filled with the passion and intensity of a rose. Like the vibrant red petals of a rose, you have experienced deep emotions and have embraced them with courage and strength.

Roses are symbols of love and passion, much like your dedication to pursuing what truly matters to you. Your passionate spirit is a source of inspiration for those around you.

Your Mood: A Rose in Bloom

Just as roses captivate with their beauty, your entries reflect a passionate and intense outlook. Your fervor and dedication are truly inspiring, reminding us all that passion can drive us to achieve great things.`
                };
            case 'Resilience':
                return {
                    flower: 'Orchid',
                    writeup: `This week, your journaling has painted a beautiful picture of your mood and experiences. Like a delicate yet resilient orchid, you've shown incredible strength and grace through life's challenges.

Orchids are known for their ability to thrive in diverse environments, much like how you navigate the ups and downs with elegance and persistence.

Your Mood: An Orchid in Bloom

Just as orchids bloom with unique beauty, your entries reflect a unique blend of emotions and thoughts. Despite any adversity, you continue to grow and blossom. Your strength and resilience are truly inspiring, reminding us all that even in difficult times, we can find beauty and growth.`
                };
            case 'Melancholy':
                return {
                    flower: 'Bluebell',
                    writeup: `This week, your journaling reflects the gentle sorrow and quiet beauty of a bluebell. Like the delicate blue petals, your emotions have been tender and introspective, revealing a deeper sense of contemplation and reflection.

Bluebells are symbols of humility and constancy, much like your ability to stay true to your feelings and navigate through the quieter, more reflective moments of life.

Your Mood: A Bluebell in Bloom

Just as bluebells grace the woods with their subtle presence, your entries reflect a thoughtful and introspective state of mind. Your gentle melancholy is truly inspiring, reminding us all that there is beauty in every emotion, even the more somber ones.`
                };
            default:
                return {
                    flower: 'Seedling',
                    writeup: 'Check back in a few days to see your mood flower!'
                };
        }
    };

    const { flower, writeup } = getMoodContent(mood);

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <img src={flowerImages[flower]} alt={flower} className={styles.flowerImage} />
                    <h2 className={styles.flowerTitle}>{flower}</h2>
                    <p className={styles.writeup}>{writeup}</p>
                </div>
            </div>
        </div>
    );
};

export default InsightsPageView;


