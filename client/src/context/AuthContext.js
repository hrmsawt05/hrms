import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loginUser as apiLoginUser } from '../api/authService';
// ⭐ THE FIX: Importing 'clockOut' instead of the old 'markMyAttendance'
import { getMyProfile, clockOut } from '../api/employeeService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const initializeAuth = useCallback(async () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const profileData = await getMyProfile();
                setUser(profileData);
                localStorage.setItem('user', JSON.stringify(profileData));
            } catch (error) {
                console.error("Session token is invalid or expired. Logging out.", error);
                setUser(null);
                setToken(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const login = async (credentials) => {
        const data = await apiLoginUser(credentials);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
    };

    const coreLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };
    
    const logoutWithAttendanceCheck = async () => {
        try {
            // ⭐ THE FIX: Call the correct clockOut function. 
            // The backend now handles all the logic for determining the status.
            await clockOut();
            console.log("Successfully clocked out on the backend.");
        } catch (error) {
            console.log("Could not auto-clock out (might be already clocked out or not clocked in).", error.message);
        } finally {
            // Always log the user out on the frontend
            coreLogout();
        }
    };
    
    const updateUserContext = useCallback(async () => {
        try {
            const updatedProfileData = await getMyProfile();
            setUser(updatedProfileData);
            localStorage.setItem('user', JSON.stringify(updatedProfileData));
        } catch (error) {
            console.error("Failed to update user context after profile edit:", error);
        }
    }, []);


    const value = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout: coreLogout, // The simple logout
        logoutWithAttendanceCheck, // The smart logout
        updateUserContext,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

