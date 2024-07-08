import React from 'react';
import styles from "../../styles/insights/InsightsPage.module.css";
import sunflower from '../../assets/sunflower.png';
import dandelion from '../../assets/dandelion.png';
import rose from '../../assets/rose.png';
import orchid from '../../assets/orchid.png';
import bluebell from '../../assets/bluebell.png';
import seedling from '../../assets/seedling.png';

const flowerImages = {
    Sunflower: sunflower,
    Dandelion: dandelion,
    Rose: rose,
    Orchid: orchid,
    Bluebell: bluebell,
    Seedling: seedling
};

const getMoodContent = (mood) => {
    switch(mood) {
        case 'Joy':
            return {
                flower: 'Sunflower',
                writeup: `The past 7 days, your journaling radiates with the warmth and positivity of a sunflower. Like a sunflower turning towards the sun, you have embraced the bright side of life, spreading joy and positivity wherever you go.

Sunflowers are symbols of adoration and loyalty, much like your unwavering commitment to finding happiness in the little things. Your joyful spirit is infectious, lighting up the lives of those around you.

<b>Your Mood: A Sunflower in Bloom</b>

Just as sunflowers reach for the sky, your entries reflect an upward, positive outlook. Your joy and enthusiasm are truly inspiring, reminding us all that with a little sunshine, we can all grow and thrive.`
            };
        case 'Courage':
            return {
                flower: 'Dandelion',
                writeup: `The past 7 days, your journaling exudes the courage and resilience of a dandelion. Like the dandelion that flourishes in adversity, you have shown remarkable bravery and strength in the face of challenges.

Dandelions are known for their hardiness and perseverance, much like your ability to stand tall and remain steadfast even in difficult times. Your courageous nature is an inspiration to those around you.

<b>Your Mood: A Dandelion in Bloom</b>

Just as dandelions spread their seeds far and wide, your entries reflect a spirit of courage and determination. Your bravery and resilience are truly inspiring, reminding us all that with courage, we can overcome any obstacle.`
            };
        case 'Passion':
            return {
                flower: 'Rose',
                writeup: `The past 7 days, your journaling is filled with the passion and intensity of a rose. Like the vibrant red petals of a rose, you have experienced deep emotions and have embraced them with courage and strength.

Roses are symbols of love and passion, much like your dedication to pursuing what truly matters to you. Your passionate spirit is a source of inspiration for those around you.

<b>Your Mood: A Rose in Bloom</b>

Just as roses captivate with their beauty, your entries reflect a passionate and intense outlook. Your fervor and dedication are truly inspiring, reminding us all that passion can drive us to achieve great things.`
            };
        case 'Resilience':
            return {
                flower: 'Orchid',
                writeup: `The past 7 days, your journaling has painted a beautiful picture of your mood and experiences. Like a delicate yet resilient orchid, you've shown incredible strength and grace through life's challenges.

Orchids are known for their ability to thrive in diverse environments, much like how you navigate the ups and downs with elegance and persistence.

<b>Your Mood: An Orchid in Bloom</b>

Just as orchids bloom with unique beauty, your entries reflect a unique blend of emotions and thoughts. Despite any adversity, you continue to grow and blossom. Your strength and resilience are truly inspiring, reminding us all that even in difficult times, we can find beauty and growth.`
            };
        case 'Melancholy':
            return {
                flower: 'Bluebell',
                writeup: `The past 7 days, your journaling reflects the gentle sorrow and quiet beauty of a bluebell. Like the delicate blue petals, your emotions have been tender and introspective, revealing a deeper sense of contemplation and reflection.

Bluebells are symbols of humility and constancy, much like your ability to stay true to your feelings and navigate through the quieter, more reflective moments of life.

<b>Your Mood: A Bluebell in Bloom</b>

Just as bluebells grace the woods with their subtle presence, your entries reflect a thoughtful and introspective state of mind. Your gentle melancholy is truly inspiring, reminding us all that there is beauty in every emotion, even the more somber ones.`
            };
        default:
            return {
                flower: 'Seedling',
                writeup: `<b>Your Mood: Blooming Seedling</b><br />Check back in a few days to see your mood flower!`
            };
    }
};

const InsightsPageView = ({ weeklyMoodCounts }) => {
    const getDominantMood = () => {
        const moodCounts = weeklyMoodCounts.reduce((acc, week) => {
            Object.keys(week).forEach(mood => {
                acc[mood] = (acc[mood] || 0) + week[mood];
            });
            return acc;
        }, {});

        if (Object.values(moodCounts).every(count => count === 0)) {
            return 'Seedling';
        }

        const moodHierarchy = ['Joy', 'Passion', 'Courage', 'Resilience', 'Melancholy'];
        const sortedMoods = moodHierarchy.filter(mood => moodCounts[mood] > 0);

        return sortedMoods.length > 0 ? sortedMoods[0] : 'Seedling';
    };

    const mood = getDominantMood();
    const { flower, writeup } = getMoodContent(mood);

    return (
        <div className={styles.screen}>
            <div className={styles.content}>
                <div className={styles.transcContainer}>
                    <img src={flowerImages[flower]} alt={flower} className={styles.flowerImage} />
                    <h2 className={styles.flowerTitle}>{flower}</h2>
                    <p className={styles.writeup} dangerouslySetInnerHTML={{ __html: writeup.replace(/\n/g, '<br />') }}></p>
                </div>
            </div>
        </div>
    );
};

export default InsightsPageView;

