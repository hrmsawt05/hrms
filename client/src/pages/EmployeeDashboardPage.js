import React, { useState } from 'react';

// ⭐ Import all the components you've built for the employee dashboard
import MyProfile from './MyProfile.js';
import LeaveManagement from './LeaveManagement.js';
import MySalary from './MySalary.js';

// Assuming mock data and auth token for demonstration
const mockAuthToken = "mock-jwt-token-for-employee";
const mockUser = {
  _id: 'emp1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'employee',
};

// Main App component for demonstration
function App() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <EmployeeDashboard />
    </div>
  );
}

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(mockUser); // Replace with real user data from local storage

  // Simple function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Redirect to login page
  };

  // Helper function to render the active component based on the selected tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        // ⭐ Render the MyProfile component
        return <MyProfile />;
      case 'leaves':
        // ⭐ Render the LeaveManagement component
        return <LeaveManagement />;
      case 'salary':
        // ⭐ Render the MySalary component
        return <MySalary />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 shadow-xl">
        <div className="text-2xl font-bold text-blue-400 mb-10">HRMS Employee</div>
        <nav className="flex-grow space-y-2">
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
            text="My Profile"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><polyline points="9 16 12 19 19 12"></polyline></svg>}
            text="Leave Management"
            active={activeTab === 'leaves'}
            onClick={() => setActiveTab('leaves')}
          />
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
            text="My Salary"
            active={activeTab === 'salary'}
            onClick={() => setActiveTab('salary')}
          />
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-lg font-semibold text-gray-200 hover:bg-red-600 rounded-xl transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-xl"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Welcome, {user.name}!
          </h1>
          <p className="text-gray-500 mt-2">Your personal HRMS dashboard.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// NavItem component for the sidebar links
const NavItem = ({ icon, text, active, onClick }) => {
  const baseClasses = "flex items-center w-full px-4 py-3 text-lg font-semibold rounded-xl transition-colors duration-200";
  const activeClasses = "bg-blue-600 text-white shadow-lg";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      {text}
    </button>
  );
};

export default App;
