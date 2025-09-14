// This file holds all API calls for the employee/faculty dashboard.

//Using the same live backend URL for deployment
const API_BASE_URL = 'https://hrms-sght.onrender.com/api';

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
    
    // THE FIX: Prepending the base URL to every API call
    const response = await fetch(`${API_BASE_URL}${url}`, config);

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
export const getMyProfile = () => apiCall('/employees/profile/me');
export const updateMyProfile = (userData) => apiCall('/employees/profile/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
});
export const changeMyPassword = (passwordData) => apiCall('/employees/profile/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
});


// --- Leave ---
export const getMyLeaveRequests = () => apiCall('/leaves/my-requests');
export const createLeaveRequest = (leaveData) => apiCall('/leaves/apply', {
    method: 'POST',
    body: JSON.stringify(leaveData),
});
export const getLeaveSummary = () => apiCall('/leaves/my-summary');


// --- Attendance Time Clock Functions ---
export const clockIn = () => apiCall('/attendance/clockin', { method: 'POST' });
export const clockOut = () => apiCall('/attendance/clockout', { method: 'POST' });
export const getMyAttendanceRecords = () => apiCall('/attendance/my-records');


// --- Salary ---
export const getMySalaryRecords = () => apiCall('/salaries/my-records');


// --- To-Do List (Notice Board) Functions ---
export const getTodos = () => apiCall('/todos');
export const createTodo = (taskData) => apiCall('/todos', {
    method: 'POST',
    body: JSON.stringify(taskData),
});
export const updateTodo = (todoId, updateData) => apiCall(`/todos/${todoId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
});
export const deleteTodo = (todoId) => apiCall(`/todos/${todoId}`, {
    method: 'DELETE',
});

