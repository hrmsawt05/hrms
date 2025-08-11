// client/src/App.js
import React, { useState, useEffect } from 'react';

// Import all your pages here
import Login from './pages/Login.js';
import AdminDashboardPage from './pages/AdminDashboardPage.js';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage.js';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a stored user token and data on load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from local storage.");
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Conditional rendering based on user status and role
  const renderApp = () => {
    // Show a loading screen while we check for the user
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      );
    }
    
    // If no user is logged in, show the login page and pass a function to set the user
    if (!user) {
      return <Login onLogin={setUser} />;
    }
    
    // If user is an admin, show the admin dashboard
    if (user.role === 'admin') {
      return <AdminDashboardPage />;
    }

    // If user is an employee, show the employee dashboard
    if (user.role === 'employee') {
      return <EmployeeDashboardPage />;
    }

    // Fallback if role is not recognized
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-500">Error: User role not recognized.</p>
      </div>
    );
  };

  return renderApp();
}

export default App;
