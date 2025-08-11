import React, { useState } from 'react';

// Assuming mock data for demonstration purposes
const mockUser = {
  _id: 'emp1',
  firstName: 'Cristiano',
  lastName: 'Ronaldo',
  email: 'ronaldo.doe@example.com',
  employeeId: 'EMP001',
  role: 'employee',
  department: 'Engineering',
  dateOfJoining: '2023-01-15',
  experience: 2,
  availableLeaves: 25,
};

// Main App component for demonstration
function App() {
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <MyProfile />
    </div>
  );
}

const MyProfile = () => {
  // This state would be populated with the logged-in user's data,
  // likely fetched from the backend or stored in local storage.
  const [user, setUser] = useState(mockUser); 

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">My Profile</h1>
      
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400">
            <img 
              src={`https://placehold.co/128x128/E0E7FF/4338CA?text=${user.firstName.charAt(0)}`} 
              alt={`${user.firstName} ${user.lastName}`} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
            <p className="text-xl text-gray-500 mt-1 capitalize">{user.role}</p>
            <p className="text-sm text-gray-500 mt-2">{user.employeeId}</p>
          </div>
        </div>
      </div>
      
      {/* Details Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Employee Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Department:</span>
            <span>{user.department}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Date of Joining:</span>
            <span>{new Date(user.dateOfJoining).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Experience:</span>
            <span>{user.experience} years</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Available Leaves:</span>
            <span className="font-bold text-blue-600">{user.availableLeaves}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
