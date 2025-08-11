// controllers/leaveController.js
const Leave = require('../models/Leave');
const User = require('../models/User'); // We need this to link leave requests to the user

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private/Employee
const createLeaveRequest = async (req, res) => {
    try {
        const { leaveType, fromDate, toDate } = req.body;
        // The user ID comes from the authenticated request object
        const employeeId = req.user._id;

        const newLeaveRequest = new Leave({
            leaveType,
            employeeId,
            fromDate,
            toDate,
            status: 'pending', // All new requests start as 'pending'
        });

        await newLeaveRequest.save();

        res.status(201).json({
            message: 'Leave request submitted successfully',
            leave: newLeaveRequest,
        });
    } catch (err) {
        console.error('Create leave request error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all leave requests (Admin only)
// @route   GET /api/leaves
// @access  Private/Admin
const getAllLeaveRequests = async (req, res) => {
    try {
        // Find all leave requests and populate the employee details
        const leaves = await Leave.find().populate('employeeId', 'name email');
        res.status(200).json(leaves);
    } catch (err) {
        console.error('Get all leave requests error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get a single user's leave requests
// @route   GET /api/leaves/my-leaves
// @access  Private/Employee
const getMyLeaveRequests = async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user._id });
        res.status(200).json(leaves);
    } catch (err) {
        console.error('Get my leave requests error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a leave request status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private/Admin
const updateLeaveRequest = async (req, res) => {
    try {
        const { status, rejectedReason } = req.body;
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Only allow 'pending' requests to be updated
        if (leave.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot update a non-pending leave request' });
        }

        leave.status = status; // 'approved' or 'rejected'
        leave.approvedBy = req.user._id; // The admin who is approving/rejecting
        if (rejectedReason) leave.rejectedReason = rejectedReason;

        await leave.save();

        res.status(200).json({
            message: `Leave request ${status} successfully`,
            leave,
        });
    } catch (err) {
        console.error('Update leave request error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createLeaveRequest,
    getAllLeaveRequests,
    getMyLeaveRequests,
    updateLeaveRequest,
};
