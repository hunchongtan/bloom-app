import { useState } from "react";
import styles from "../styles/login/Login.module.css";

const LoginView = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            // Clear previous error messages
            setError(null);
            setMessage('');
    
            console.log('Submitting login form with username:', username);
    
            // First, check if the username exists
            let response = await fetch(`/users/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('GET /users response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('GET /users data:', data);

                if (data.user_id) {
                    // Username exists, retrieve the user_id
                    console.log('User found:', data);

                    localStorage.setItem('userId', data.user_id.toString());
                    localStorage.setItem('name', data.name.toString());
                    setMessage('User found. Authorising...');
                    setTimeout(() => {
                        window.location.replace('/home');
                    }, 3000); // Delay for 3 seconds
                    return;
                }
            } else {
                console.log('GET /users failed:', response.status, response.statusText);
            }
    
            // If the username doesn't exist, create a new user
            response = await fetch('/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                }),
            });

            console.log('POST /users response:', response);

            // Check if the response is OK (status code 200-299)
            if (!response.ok) {
                // Try to parse the error message
                let errorText;
                try {
                    errorText = await response.json();
                } catch {
                    errorText = await response.text();
                }
                console.log('POST /users error:', errorText);
                throw new Error(errorText || 'Login failed');
            }
    
            const data = await response.json();
            console.log('POST /users data:', data);

            const { user_id, name } = data;
    
            // Store the user_id in localStorage or sessionStorage for use in your app
            localStorage.setItem('userId', user_id.toString());
            localStorage.setItem('name', name.toString());
    
            setMessage('User created. Authorising...');
            setTimeout(() => {
                window.location.replace('/home');
            }, 3000); // Delay for 3 seconds
            
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
                    autoComplete="username" // Added autocomplete attribute
                />
                <button 
                    type="submit" 
                    className={styles.loginButton} 
                    disabled={!username.trim()} // Disable button if username is empty
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
