import React, { useState, useEffect } from 'react';
import { getMyProfile, updateMyProfile, changeMyPassword } from '../api/employeeService';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { Edit, KeyRound } from 'lucide-react';

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
const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeInUp">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
            {children}
        </div>
    </div>
);


const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    // ⭐ Destructure the new function from our context
    const { updateUserContext } = useAuth(); 

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

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!profile) return <ErrorDisplay message="Could not load profile data." />;

    return (
        <div className="animate-fadeIn">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-bold text-gray-900">My Profile</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal and employment details.</p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={() => setIsEditModalOpen(true)} className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"><Edit size={16} className="mr-2"/> Edit Profile</button>
                        <button onClick={() => setIsPasswordModalOpen(true)} className="flex items-center bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"><KeyRound size={16} className="mr-2"/> Change Password</button>
                    </div>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                           <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                           <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">{`${profile.firstName} ${profile.lastName}`}</dd>
                        </div>
                        <ProfileDetail label="Email Address" value={profile.email} />
                        <ProfileDetail label="Employee ID" value={profile.employeeIdString} />
                        <ProfileDetail label="Position" value={profile.position} />
                        <ProfileDetail label="Department" value={profile.department?.departmentName} />
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                           <dt className="text-sm font-medium text-gray-500">Date of Joining</dt>
                           <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{format(new Date(profile.dateOfJoining), 'MMMM d, yyyy')}</dd>
                        </div>
                        <ProfileDetail label="Available Leaves" value={`${profile.availableLeaves} days`} />
                    </dl>
                </div>
            </div>
            
            {/* ⭐ This onSave function now calls updateUserContext */}
            {isEditModalOpen && <EditProfileModal profile={profile} onClose={() => setIsEditModalOpen(false)} onSave={async () => { setIsEditModalOpen(false); await fetchProfile(); await updateUserContext(); }} />}
            {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}
        </div>
    );
};

// --- Edit Profile Modal ---
const EditProfileModal = ({ profile, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await updateMyProfile(formData);
            onSave();
        } catch (err) {
            setError(err.message || 'Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// --- Change Password Modal ---
const ChangePasswordModal = ({ onClose }) => {
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const res = await changeMyPassword(formData);
            setSuccess(res.message);
            setFormData({ oldPassword: '', newPassword: '' }); 
        } catch (err) {
            setError(err.message || 'Failed to change password.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Modal onClose={onClose}>
             <h3 className="text-2xl font-bold mb-6">Change Password</h3>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Old Password</label>
                    <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}

                 <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {isSubmitting ? 'Changing...' : 'Update Password'}
                    </button>
                </div>
             </form>
        </Modal>
    );
};

export default MyProfile;

