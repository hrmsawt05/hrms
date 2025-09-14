const Leave = require('../models/Leave');
const User = require('../models/User');

// --- Helper function to calculate the number of days between two dates ---
const calculateNumberOfDays = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    // Set to UTC midnight to avoid timezone issues in day calculation
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);
    // Calculate the difference in time
    const diffTime = Math.abs(end - start);
    // Calculate the difference in days, adding 1 to make the period inclusive
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
};


/**
 * @desc    An employee/faculty member creates a new leave request
 * @route   POST /api/leaves/apply
 * @access  Private (Employee)
 */
const createLeaveRequest = async (req, res) => {
    try {
        const { leaveType, fromDate, toDate, reason } = req.body;
        const employeeId = req.user._id; // Securely get user ID from token

        // --- Server-side Validation ---
        if (!leaveType || !fromDate || !toDate || !reason) {
            return res.status(400).json({ message: 'All fields (Leave Type, From Date, To Date, Reason) are required.' });
        }
        if (new Date(fromDate) > new Date(toDate)) {
            return res.status(400).json({ message: 'Start date cannot be after the end date.' });
        }
        
        const numberOfDays = calculateNumberOfDays(fromDate, toDate);

        // --- Check if the employee has enough available leaves ---
        const user = await User.findById(employeeId);
        if (user.availableLeaves < numberOfDays) {
            return res.status(400).json({ message: `You only have ${user.availableLeaves} leaves available. Cannot apply for ${numberOfDays} days.` });
        }

        const newLeaveRequest = new Leave({
            employeeId,
            leaveType,
            fromDate,
            toDate,
            reason,
            numberOfDays
        });

        await newLeaveRequest.save();

        res.status(201).json({
            message: 'Leave request submitted successfully. It is now pending approval.',
            leave: newLeaveRequest,
        });

    } catch (err) {
        console.error('Create leave request error:', err);
        res.status(500).json({ message: 'Server error while creating leave request.', error: err.message });
    }
};


/**
 * @desc    Admin gets all leave requests from all employees
 * @route   GET /api/leaves
 * @access  Private (Admin)
 */
const getAllLeaveRequests = async (req, res) => {
    try {
        const leaves = await Leave.find({})
            .populate('employeeId', 'firstName lastName email') // Populate with employee details
            .sort({ createdAt: -1 }); // Show the newest requests first
        res.status(200).json(leaves);
    } catch (err) {
        console.error('Get all leave requests error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


/**
 * @desc    An employee gets their own leave history
 * @route   GET /api/leaves/my-requests
 * @access  Private (Employee)
 */
const getMyLeaveRequests = async (req, res) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(leaves);
    } catch (err) {
        console.error('Get my leave requests error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


/**
 * @desc    Admin updates a leave request status (Approve/Reject)
 * @route   PUT /api/leaves/:id
 * @access  Private (Admin)
 */
const updateLeaveRequest = async (req, res) => {
    try {
        const { status, rejectedReason } = req.body;
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        if (leave.status !== 'pending') {
            return res.status(400).json({ message: 'This leave request has already been processed and cannot be changed.' });
        }
        
        // --- Core Business Logic: Update available leave balance on approval ---
        if (status === 'approved') {
            const user = await User.findById(leave.employeeId);
            if (!user) {
                return res.status(404).json({ message: 'Employee record not found.' });
            }
            
            // Deduct the leave days from the user's balance
            user.availableLeaves -= leave.numberOfDays;
            await user.save({ validateBeforeSave: false }); // Skip other model validations
        }

        leave.status = status;
        leave.approvedBy = req.user._id; // Log which admin processed the request
        if (status === 'rejected') {
            leave.rejectedReason = rejectedReason || 'No reason provided by administrator.';
        }

        await leave.save();

        res.status(200).json({
            message: `Leave request has been ${status} successfully.`,
            leave,
        });
    } catch (err) {
        console.error('Update leave request error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Admin deletes a leave request
 * @route   DELETE /api/leaves/:id
 * @access  Private (Admin)
 */
const deleteLeaveRequest = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // --- Core Business Logic: Refund leave days if an approved request is deleted ---
        if (leave.status === 'approved') {
            const user = await User.findById(leave.employeeId);
            if (user) {
                user.availableLeaves += leave.numberOfDays;
                await user.save({ validateBeforeSave: false });
            }
        }

        await leave.deleteOne();

        res.status(200).json({ message: 'Leave request has been deleted successfully.' });

    } catch (err) {
        console.error('Delete leave request error:', err);
        res.status(500).json({ message: 'Server error while deleting leave request.' });
    }
};


/**
 * @desc    Get summary data (e.g., pending requests) for an employee's dashboard
 * @route   GET /api/leaves/my-summary
 * @access  Private (Employee)
 */
const getLeaveSummaryForEmployee = async (req, res) => {
    try {
        // Efficiently count only the pending requests for the logged-in user
        const pendingRequests = await Leave.countDocuments({ 
            employeeId: req.user._id, 
            status: 'pending' 
        });
        
        res.status(200).json({ pendingRequests });
    } catch (err) {
        console.error('Get leave summary error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Export all functions to be used in the routes file
module.exports = {
    createLeaveRequest,
    getAllLeaveRequests,
    getMyLeaveRequests,
    updateLeaveRequest,
    deleteLeaveRequest,
    getLeaveSummaryForEmployee
};

