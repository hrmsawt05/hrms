import React, { useState } from 'react';
// The import for react-icons/lu has been removed and replaced with inline SVGs.

// ⭐ Import all the components you've built for the admin dashboard
import EmployeeManagement from './EmployeeManagement.js';
import LeaveRequests from './LeaveRequests.js';
import PayrollManagement from './PayrollManagement.js';
import SalaryStructurePage from './SalaryStructurePage.js';

// Main App component for demonstration purposes
function App() {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <AdminDashboard />
    </div>
  );
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');

  // Simple function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/'; // Redirect to login page
  };

  // Helper function to render the active component
  const renderContent = () => {
    switch (activeTab) {
      case 'employees':
        // ⭐ Render the EmployeeManagement component
        return <EmployeeManagement />;
      case 'leaves':
        // ⭐ Render the LeaveRequests component
        return <LeaveRequests />;
      case 'salaries':
        // ⭐ Render the PayrollManagement component
        return <PayrollManagement />;
      case 'salary-structures':
        // ⭐ Render the SalaryStructurePage component
        return <SalaryStructurePage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 shadow-xl">
        <div className="text-2xl font-bold text-blue-400 mb-10">HRMS Admin</div>
        <nav className="flex-grow space-y-2">
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
            text="Employees"
            active={activeTab === 'employees'}
            onClick={() => setActiveTab('employees')}
          />
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><polyline points="9 16 12 19 19 12"></polyline></svg>}
            text="Leave Requests"
            active={activeTab === 'leaves'}
            onClick={() => setActiveTab('leaves')}
          />
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
            text="Salary Structures"
            active={activeTab === 'salary-structures'}
            onClick={() => setActiveTab('salary-structures')}
          />
          <NavItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
            text="Payroll Management"
            active={activeTab === 'salaries'}
            onClick={() => setActiveTab('salaries')}
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
            Welcome, Admin!
          </h1>
          <p className="text-gray-500 mt-2">Manage your HRMS with ease.</p>
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
