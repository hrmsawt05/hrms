// This file will hold all API calls for the admin dashboard.

const getToken = () => localStorage.getItem('token');
const getAuthHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
    };
};

// --- Helper for API calls ---
const apiCall = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    // Handle cases where the response body might be empty (e.g., DELETE requests)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return {}; // Return empty object for non-JSON responses
};


// --- User/Employee Management ---

export const getAllUsers = () => {
    return apiCall('/api/employees', { headers: getAuthHeaders() });
};

export const createUser = (userData) => {
    return apiCall('/api/employees', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    });
};


// --- Department Management ---

export const getDepartments = () => {
    return apiCall('/api/departments', { headers: getAuthHeaders() });
};


// --- Leave Management ---

export const getLeaveRequests = () => {
    return apiCall('/api/leaves', { headers: getAuthHeaders() });
};

export const updateLeaveRequestStatus = (leaveId, statusData) => {
    return apiCall(`/api/leaves/${leaveId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(statusData),
    });
};


// --- Salary Structure Management ---

export const getSalaryStructures = () => {
    return apiCall('/api/salary-structures', { headers: getAuthHeaders() });
};

export const createSalaryStructure = (structureData) => {
    return apiCall('/api/salary-structures', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(structureData),
    });
};

export const updateSalaryStructure = (structureId, structureData) => {
    return apiCall(`/api/salary-structures/${structureId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(structureData),
    });
};

export const deleteSalaryStructure = (structureId) => {
    return apiCall(`/api/salary-structures/${structureId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
};


// --- Payroll Management ---

export const createSalaryRecord = (recordData) => {
    return apiCall('/api/salaries', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(recordData),
    });
};

export const getAllSalaryRecords = () => {
    return apiCall('/api/salaries', { headers: getAuthHeaders() });
};

