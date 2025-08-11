// controllers/employeeController.js
const Employee = require('../models/Employee');

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, departmentId } = req.body;

        const newEmployee = new Employee({ firstName, lastName, email, password, role, departmentId });
        await newEmployee.save();

        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (err) {
        console.error('Create employee error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).json(employees);
    } catch (err) {
        console.error('Get all employees error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin & Employee
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (err) {
        console.error('Get employee by ID error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createEmployee, getAllEmployees, getEmployeeById };
