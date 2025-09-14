// This file holds all API calls for the employee/faculty dashboard.

const getToken = () => localStorage.getItem('token');

// --- Helper for API calls to keep our code DRY (Don't Repeat Yourself) ---
const apiCall = async (url, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
    };
    const config = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
    };
    const response = await fetch(url, config);
    if (!response.ok) {
        try {
            const data = await response.json();
            throw new Error(data.message || `Request failed with status ${response.status}`);
        } catch (e) {
            throw new Error(`Request failed with status ${response.status}`);
        }
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return {};
};


// --- Profile ---
export const getMyProfile = () => apiCall('/api/employees/profile/me');
export const updateMyProfile = (userData) => apiCall('/api/employees/profile/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
});
export const changeMyPassword = (passwordData) => apiCall('/api/employees/profile/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
});


// --- Leave ---
export const getMyLeaveRequests = () => apiCall('/api/leaves/my-requests');
export const createLeaveRequest = (leaveData) => apiCall('/api/leaves/apply', {
    method: 'POST',
    body: JSON.stringify(leaveData),
});
export const getLeaveSummary = () => apiCall('/api/leaves/my-summary');


// ---  Attendance Time Clock Functions ---
/**
 * Employee clocks in for the day.
 * @returns {Promise<object>}
 */
export const clockIn = () => apiCall('/api/attendance/clockin', { method: 'POST' });

/**
 * Employee clocks out for the day.
 * @returns {Promise<object>}
 */
export const clockOut = () => apiCall('/api/attendance/clockout', { method: 'POST' });

/**
 * Fetches all attendance records for the currently logged-in user.
 * @returns {Promise<array>}
 */
export const getMyAttendanceRecords = () => apiCall('/api/attendance/my-records');


// --- Salary ---
export const getMySalaryRecords = () => apiCall('/api/salaries/my-records');


// --- To-Do List (Notice Board) Functions ---
export const getTodos = () => apiCall('/api/todos');
export const createTodo = (taskData) => apiCall('/api/todos', {
    method: 'POST',
    body: JSON.stringify(taskData),
});
export const updateTodo = (todoId, updateData) => apiCall(`/api/todos/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
});
export const deleteTodo = (todoId) => apiCall(`/api/todos/${todoId}`, {
    method: 'DELETE',
});

