// This file holds all API calls for the admin dashboard.

//  Replace this with your actual Render backend URL
const API_BASE_URL = 'https://hrms-sght.onrender.com/api';

const getToken = () => localStorage.getItem('token');

// --- Helper for API calls ---
const apiCall = async (url, options = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
    };
    const config = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
    };

    // Prepend the base URL to every API call
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


// --- User/Faculty & Staff Management ---
export const getAllUsers = () => apiCall('/employees');
export const createUser = (userData) => apiCall('/employees', {
    method: 'POST',
    body: JSON.stringify(userData),
});
export const updateUser = (userId, userData) => apiCall(`/employees/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
});
export const deleteUser = (userId) => apiCall(`/employees/${userId}`, {
    method: 'DELETE',
});


// --- Department Management ---
export const getDepartments = () => apiCall('/departments');
export const createDepartment = (departmentData) => apiCall('/departments', {
    method: 'POST',
    body: JSON.stringify(departmentData),
});
export const updateDepartment = (id, departmentData) => apiCall(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(departmentData),
});
export const deleteDepartment = (id) => apiCall(`/departments/${id}`, {
    method: 'DELETE',
});


// --- Leave Management ---
export const getLeaveRequests = () => apiCall('/leaves');
export const updateLeaveRequestStatus = (leaveId, statusData) => apiCall(`/leaves/${leaveId}`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
});
export const deleteLeaveRequest = (leaveId) => apiCall(`/leaves/${leaveId}`, {
    method: 'DELETE',
});


// --- Salary Structure Management ---
export const getSalaryStructures = () => apiCall('/salary-structures');
export const createSalaryStructure = (structureData) => apiCall('/salary-structures', {
    method: 'POST',
    body: JSON.stringify(structureData),
});
export const updateSalaryStructure = (structureId, structureData) => apiCall(`/salary-structures/${structureId}`, {
    method: 'PUT',
    body: JSON.stringify(structureData),
});
export const deleteSalaryStructure = (structureId) => apiCall(`/salary-structures/${structureId}`, {
    method: 'DELETE',
});


// --- Payroll Management ---
export const createSalaryRecord = (recordData) => apiCall('/salaries', {
    method: 'POST',
    body: JSON.stringify(recordData),
});
export const getAllSalaryRecords = () => apiCall('/salaries');

// --- Admin Attendance Viewer ---
export const getAttendanceForEmployee = (employeeId) => apiCall(`/attendance/admin/employee/${employeeId}`);

