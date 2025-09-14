// This file holds all API calls for the admin dashboard.

const getToken = () => localStorage.getItem('token');

// --- Helper for API calls ---
const apiCall = async (url, options = {}) => {
    //
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        // Try to parse error message from the backend, otherwise use default
        try {
            const data = await response.json();
            throw new Error(data.message || `Request failed with status ${response.status}`);
        } catch (e) {
            throw new Error(`Request failed with status ${response.status}`);
        }
    }

    // Handle cases where the response body might be empty (e.g., DELETE requests)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }
    return {}; // Return empty object for non-JSON or empty responses
};


// --- User/Faculty & Staff Management ---

export const getAllUsers = () => {
    return apiCall('/api/employees');
};

export const createUser = (userData) => {
    return apiCall('/api/employees', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const updateUser = (userId, userData) => {
    return apiCall(`/api/employees/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

export const deleteUser = (userId) => {
    return apiCall(`/api/employees/${userId}`, {
        method: 'DELETE',
    });
};


// --- Department Management ---

export const getDepartments = () => {
    return apiCall('/api/departments');
};

export const createDepartment = (departmentData) => {
    return apiCall('/api/departments', {
        method: 'POST',
        body: JSON.stringify(departmentData),
    });
};

export const updateDepartment = (id, departmentData) => {
    return apiCall(`/api/departments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(departmentData),
    });
};

export const deleteDepartment = (id) => {
    return apiCall(`/api/departments/${id}`, {
        method: 'DELETE',
    });
};


// --- Leave Management ---

export const getLeaveRequests = () => {
    return apiCall('/api/leaves');
};

export const updateLeaveRequestStatus = (leaveId, statusData) => {
    return apiCall(`/api/leaves/${leaveId}`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
    });
};

/**
 *  Deletes a leave request from the system.
 * @param {string} leaveId - The ID of the leave request to delete.
 * @returns {Promise<object>} A success message.
 */
export const deleteLeaveRequest = (leaveId) => {
    return apiCall(`/api/leaves/${leaveId}`, {
        method: 'DELETE',
    });
};


// --- Salary Structure Management ---

export const getSalaryStructures = () => {
    return apiCall('/api/salary-structures');
};

export const createSalaryStructure = (structureData) => {
    return apiCall('/api/salary-structures', {
        method: 'POST',
        body: JSON.stringify(structureData),
    });
};

export const updateSalaryStructure = (structureId, structureData) => {
    return apiCall(`/api/salary-structures/${structureId}`, {
        method: 'PUT',
        body: JSON.stringify(structureData),
    });
};

export const deleteSalaryStructure = (structureId) => {
    return apiCall(`/api/salary-structures/${structureId}`, {
        method: 'DELETE',
    });
};


// --- Payroll Management ---

export const createSalaryRecord = (recordData) => {
    return apiCall('/api/salaries', {
        method: 'POST',
        body: JSON.stringify(recordData),
    });
};

export const getAllSalaryRecords = () => {
    return apiCall('/api/salaries');
};

// --- Admin Attendance Viewer ---

export const getAttendanceForEmployee = (employeeId) => {
    return apiCall(`/api/attendance/admin/employee/${employeeId}`);
};

