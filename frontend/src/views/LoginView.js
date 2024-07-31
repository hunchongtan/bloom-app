import { useState } from "react";
import styles from "../styles/login/Login.module.css";

const LoginView = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError(null);
            setMessage('');

            const apiUrl = '/api'; // Use the proxy path
            console.log(`Using API URL: ${apiUrl}`);

            // Fetch the user
            let response = await fetch(`${apiUrl}/users/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                const data = await response.json();
                if (data.user_id) {
                    localStorage.setItem('userId', data.user_id.toString());
                    localStorage.setItem('name', data.name.toString());
                    setMessage('User found. Authorising...');
                    setTimeout(() => {
                        window.location.replace('/home');
                    }, 3000);
                    return;
                }
            } else {
                console.error('User not found, creating a new user...');
            }

            // If user not found, create a new user
            console.log('Creating new user...');
            response = await fetch(`${apiUrl}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username }),
            });

            if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                const data = await response.json();
                const { user_id, name } = data;
                localStorage.setItem('userId', user_id.toString());
                localStorage.setItem('name', name.toString());

                setMessage('User created. Authorising...');
                setTimeout(() => {
                    window.location.replace('/homeAlt');
                }, 3000);
            } else {
                const errorText = await response.text();
                console.error('Error creating user response text:', errorText);
                throw new Error(errorText || 'Login failed');
            }

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
                <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="Username" 
                    autoComplete="username"
                />
                <button 
                    type="submit" 
                    className={styles.loginButton} 
                    disabled={!username.trim()}
                >
                    LOG IN
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}

export default LoginView;
