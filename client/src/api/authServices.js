

const API_URL = '/api/auth'; // Base URL for authentication endpoints

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Throw an error with the message from the server
        throw new Error(data.message || 'Login failed.');
    }

    return data; // Returns { message, token, user }
};

// You can add a registerUser function here as well
// export const registerUser = async (userData) => { ... };
