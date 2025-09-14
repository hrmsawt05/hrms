// The base URL for all API requests.
// When you run the app, the proxy in your package.json will forward this
// to your backend server at http://localhost:5000
const API_BASE_URL = 'https://hrms-sght.onrender.com/api';

/**
 * Logs in a user by sending a POST request to the backend.
 * @param {object} credentials - The user's email and password.
 * @returns {Promise<object>} The data from the API response (including token and user).
 */
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        // If the response is not "ok" (e.g., status 400, 401, 500),
        // we throw an error to be caught by the component.
        if (!response.ok) {
            // Use the error message from the backend, or a default message.
            throw new Error(data.message || 'An error occurred during login.');
        }

        return data;

    } catch (error) {
        // Log the error for debugging and re-throw it so the component knows about it.
        console.error("Login API call failed:", error);
        throw error;
    }
};

// You can add other auth-related API functions here later, like register or forgotPassword.

