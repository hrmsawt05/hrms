// src/api/employeeService.js

/**
 * Fetches the currently logged-in user's profile data.
 * The token from localStorage will be sent automatically by the AuthContext.
 * @returns {Promise<object>} The user's profile data.
 */
export const getMyProfile = async () => {
    const token = localStorage.getItem('token');
    // The employeeId is derived from the token on the backend, so we don't need to send it.
    // We assume an endpoint like `/api/employees/profile/me` exists for this.
    const response = await fetch('/api/employees/profile/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile.');
    }
    return response.json();
};

/**
 * Fetches all leave requests for the currently logged-in user.
 * @returns {Promise<array>} A list of the user's leave requests.
 */
export const getMyLeaveRequests = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/leaves/my-leaves', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch leave requests.');
    }
    return response.json();
};

/**
 * Submits a new leave request for the currently logged-in user.
 * @param {object} leaveData - The details of the leave request.
 * @returns {Promise<object>} The newly created leave request object.
 */
export const createLeaveRequest = async (leaveData) => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/leaves', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(leaveData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit leave request.');
    }
    return response.json();
};

/**
 * Marks the current user's attendance for today.
 * @returns {Promise<object>} The attendance record for today.
 */
export const markMyAttendance = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/attendance/me', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark attendance.');
    }
    return response.json();
};

/**
 * Fetches all salary records for the currently logged-in user.
 * @returns {Promise<array>} A list of salary records.
 */
export const getMySalaryRecords = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        throw new Error('User not found in local storage.');
    }

    const response = await fetch(`/api/salaries/employee/${user.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch salary records.');
    }
    return response.json();
};
