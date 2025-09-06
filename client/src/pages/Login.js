import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; //  context hook
import { loginUser } from '../api/authService'; //   API service

// The Login component handles all the login logic and UI
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate(); // Hook for programmatic navigation
    const { login } = useAuth(); // Get the login function from our context

    // Function to handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsSuccess(false);

        try {
            // Call the API service
            const data = await loginUser(email, password);

            // Call the context login function to update global state
            login(data.user, data.token);

            setMessage(data.message);
            setIsSuccess(true);

            // Redirect to the correct dashboard after a short delay
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/employee/dashboard');
                }
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            setMessage(error.message || 'An error occurred. Please try again.');
            setIsSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 border-t-8 border-teal-500">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">HRMS Login</h2>

                {message && (
                    <div className={`p-4 mb-4 rounded-xl text-sm font-semibold transition-all duration-300 ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors duration-300 disabled:bg-blue-300"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

//  A component file should export the component itself as the default
export default Login;
