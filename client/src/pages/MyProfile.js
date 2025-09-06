import React, { useState, useEffect } from 'react';
import { getMyProfile } from '../api/employeeService';
import { format } from 'date-fns';

// --- UI Components ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
        <p className="font-bold">Error</p>
        <p>{message}</p>
    </div>
);

const ProfileDetail = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || 'N/A'}</dd>
    </div>
);


const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await getMyProfile();
                setProfile(data);
            } catch (err) {
                setError(err.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!profile) return <ErrorDisplay message="Could not load profile data." />;

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-bold text-gray-900">
                    My Profile
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal and employment details.
                </p>
            </div>
            <div className="border-t border-gray-200">
                <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                         <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                         <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">{profile.fullName}</dd>
                    </div>
                    <ProfileDetail label="Email Address" value={profile.email} />
                    <ProfileDetail label="Employee ID" value={profile.employeeIdString} />
                    <ProfileDetail label="Position" value={profile.position} />
                    <ProfileDetail label="Department" value={profile.department?.departmentName} />
                    <ProfileDetail label="Role" value={profile.role} />
                     <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                         <dt className="text-sm font-medium text-gray-500">Date of Joining</dt>
                         <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {format(new Date(profile.dateOfJoining), 'MMMM d, yyyy')}
                        </dd>
                    </div>
                    <ProfileDetail label="Available Leaves" value={`${profile.availableLeaves} days`} />
                </dl>
            </div>
        </div>
    );
};

export default MyProfile;
