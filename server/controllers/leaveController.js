const Leave = require('../models/Leave');
const User = require('../models/User');

// Helper function to calculate the number of days between two dates
// Note: This is a simple calculation and doesn't account for weekends or holidays.
const calculateLeaveDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const differenceInTime = to.getTime() - from.getTime();
    // Add 1 to include both the start and end date
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1;
    return differenceInDays;
};

// @desc    Create a new leave request
// @route   POST /api/leaves
// @access  Private/Employee
const createLeaveRequest = async (req, res) => {
    try {
        const { leaveType, fromDate, toDate } = req.body;
        const employeeId = req.user._id;

        // --- VALIDATION ---
        if (new Date(fromDate) > new Date(toDate)) {
            return res.status(400).json({ message: 'The "from" date cannot be after the "to" date.' });
        }

        const requestedDays = calculateLeaveDays(fromDate, toDate);
        if (req.user.availableLeaves < requestedDays) {
            return res.status(400).json({ message: `You only have ${req.user.availableLeaves} leaves available.` });
        }

        const newLeaveRequest = new Leave({
            leaveType,
            employeeId,
            fromDate,
            toDate,
        });

        await newLeaveRequest.save();

        res.status(201).json({
            message: 'Leave request submitted successfully',
            leave: newLeaveRequest,
        });
    } catch (err) {
        console.error('Create leave request error:', err);
        res.status(500).json({ message: 'Server error while creating leave request.' });
    }
};

// @desc    Get all leave requests (for Admin)
// @route   GET /api/leaves
// @access  Private/Admin
const getAllLeaveRequests = async (req, res) => {
    try {
        // Updated populate to fetch more useful data for the admin
        const leaves = await Leave.find()
            .populate({
                path: 'employeeId',
                select: 'firstName lastName email',
                populate: { path: 'department', select: 'departmentName' }
            })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(leaves);
    } catch (err) {
        console.error('Get all leave requests error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get the current user's leave requests
// @route   GET /api/leaves/my-leaves
// @access  Private/Employee
const getMyLeaveRequests = async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
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
        if (leave.status !== 'pending') {
            return res.status(400).json({ message: `This leave request has already been ${leave.status}.` });
        }

        // --- CORE BUSINESS LOGIC ---
        if (status === 'approved') {
            const user = await User.findById(leave.employeeId);
            const leaveDays = calculateLeaveDays(leave.fromDate, leave.toDate);

            if (user.availableLeaves < leaveDays) {
                return res.status(400).json({
                    message: `Cannot approve. Employee only has ${user.availableLeaves} leaves available.`
                });
            }
            // Deduct the leaves
            user.availableLeaves -= leaveDays;
            await user.save();
        }

        leave.status = status;
        leave.approvedBy = req.user._id;
        if (status === 'rejected' && rejectedReason) {
            leave.rejectedReason = rejectedReason;
        }

        await leave.save();

        res.status(200).json({
            message: `Leave request has been ${status}.`,
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
