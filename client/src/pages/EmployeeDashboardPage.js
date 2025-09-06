import React from 'react';

const EmployeeDashboardPage = () => {
    // This component can be used for a summary dashboard in the future.
    // For now, the layout itself provides the main navigation.
    // We will build out the individual pages like MyProfile, MyLeave, etc.
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
            <p className="text-gray-600">
                Welcome to your personal HRMS dashboard. Use the sidebar to navigate to different sections
                like your profile, leave requests, and salary statements.
            </p>
            {/* You could add summary cards here in the future */}
        </div>
    );
};

export default EmployeeDashboardPage;

