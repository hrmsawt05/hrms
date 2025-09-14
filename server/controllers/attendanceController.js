const Attendance = require('../models/Attendance');

// Helper to get the start of the day in UTC to avoid timezone issues
const getStartOfDayUTC = (date) => {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    return start;
};

/**
 * @desc    Employee/Faculty clocks in for the day
 * @route   POST /api/attendance/clockin
 * @access  Private (Employee)
 */
const clockIn = async (req, res) => {
    try {
        const today = getStartOfDayUTC(new Date());
        const employeeId = req.user._id;

        // Check if already clocked in today to prevent duplicates
        const existingRecord = await Attendance.findOne({ employeeId, date: today });
        if (existingRecord) {
            return res.status(400).json({ message: 'You have already clocked in for today.' });
        }

        const newRecord = await Attendance.create({
            employeeId,
            date: today,
            loginTime: new Date(), // Set the current time as login time
            status: 'in-progress', // The day is in progress
        });

        res.status(201).json({ message: 'Successfully clocked in for the day.', record: newRecord });

    } catch (err) {
        console.error("Clock-in error:", err);
        res.status(500).json({ message: 'Server error during clock-in.' });
    }
};

/**
 * @desc    Employee/Faculty clocks out for the day
 * @route   POST /api/attendance/clockout
 * @access  Private (Employee)
 */
const clockOut = async (req, res) => {
    try {
        const today = getStartOfDayUTC(new Date());
        const employeeId = req.user._id;

        const record = await Attendance.findOne({ employeeId, date: today });
        if (!record) {
            return res.status(404).json({ message: "Cannot clock out because you haven't clocked in today." });
        }
        if (record.logoutTime) {
            return res.status(400).json({ message: 'You have already clocked out for today.' });
        }

        const logoutTime = new Date();
        record.logoutTime = logoutTime;

        // --- Your College's Business Logic for Status ---
        const logoutHour = logoutTime.getHours(); // Based on server time (should be set to IST)
        if (logoutHour < 12) { // Before 12:00 PM
            record.status = 'absent';
            record.notes = 'Logged out before noon.';
        } else if (logoutHour < 16) { // Between 12:00 PM and 4:00 PM (16:00)
            record.status = 'half-day';
            record.notes = 'Logged out after noon.';
        } else { // 4:00 PM or later
            record.status = 'present';
            record.notes = 'Completed full day.';
        }
        
        await record.save();

        res.status(200).json({ message: 'Successfully clocked out. Your status for today is now recorded.', record });

    } catch (err) {
        console.error("Clock-out error:", err);
        res.status(500).json({ message: 'Server error during clock-out.' });
    }
};


/**
 * @desc    An employee gets their own attendance records
 * @route   GET /api/attendance/my-records
 * @access  Private (Employee)
 */
const getMyAttendanceRecords = async (req, res) => {
    try {
        const records = await Attendance.find({ employeeId: req.user._id }).sort({ date: -1 });
        res.status(200).json(records);
    } catch (error) {
        console.error("Get my attendance error:", error);
        res.status(500).json({ message: "Server error." });
    }
};


/**
 * @desc    Admin gets all attendance records for a specific employee
 * @route   GET /api/attendance/admin/employee/:employeeId
 * @access  Private (Admin)
 */
const getEmployeeAttendanceForAdmin = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const records = await Attendance.find({ employeeId }).populate('employeeId', 'firstName lastName').sort({ date: -1 });
        res.status(200).json(records);
    } catch (error) {
        console.error("Admin get employee attendance error:", error);
        res.status(500).json({ message: "Server error." });
    }
};


module.exports = {
    clockIn,
    clockOut,
    getMyAttendanceRecords,
    getEmployeeAttendanceForAdmin,
};

