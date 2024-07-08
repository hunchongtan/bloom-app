import { useState } from "react";
import styles from "../styles/login/Login.module.css";

const LoginView = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Commenting out the actual fetch call
            // const response = await fetch('/users/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         name: username,
            //     }),
            // });

            // Check if the response is OK (status code 200-299)
            // if (!response.ok) {
            //     // Try to parse the error message
            //     let errorText;
            //     try {
            //         errorText = await response.json();
            //     } catch {
            //         errorText = await response.text();
            //     }
            //     throw new Error(errorText || 'Login failed');
            // }

            // const data = await response.json();

            // Hardcoding a JSON response for testing
            const data = { "name": "xiaoming", "user_id": 4 };

            // Assuming the API response includes user_id upon successful creation or retrieval
            const { user_id } = data;
            const { name } = data;
            
            // Store the user_id in localStorage or sessionStorage for use in your app
            localStorage.setItem('userId', user_id.toString()); // Store user_id as string
            localStorage.setItem('name', name.toString());
            
            // Redirect to another page after successful login
            window.location.replace('/home');
            
        } catch (error) {
            console.error('Error logging in:', error.message);
            setError(error.message);
        }
    };

    return (
        <div className={styles.screen}>
            <h2>Bloom</h2>
            <h3>New Gen of Journaling</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                <button type="submit" className={styles.loginButton}>LOG IN</button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}

export default LoginView;


