const Attendance = require('../models/Attendance');

// Helper to get the start of a given date (to ignore time)
const getStartOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

// @desc    An Employee marks their OWN attendance for today
// @route   POST /api/attendance/mark
// @access  Private/Employee
const markMyAttendance = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const employeeId = req.user._id;

        const today = getStartOfDay(new Date());

        // Find a record for this employee for today and update it, OR create it if it doesn't exist.
        // This is an "upsert" operation and prevents duplicate entries.
        const attendance = await Attendance.findOneAndUpdate(
            {
                employeeId: employeeId,
                date: today,
            },
            {
                $set: {
                    status,
                    notes,
                    employeeId
                },
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json({ message: "Attendance for today has been recorded.", attendance });
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ message: "Server error while marking attendance." });
    }
};


// @desc    An Admin logs or updates attendance for any employee on any date
// @route   POST /api/attendance/admin/log
// @access  Private/Admin
const adminLogOrUpdateAttendance = async (req, res) => {
    try {
        const { employeeId, date, status, notes } = req.body;

        const targetDate = getStartOfDay(date);

        const attendance = await Attendance.findOneAndUpdate(
            { employeeId, date: targetDate },
            { $set: { status, notes, employeeId } },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json({ message: "Attendance record has been saved.", attendance });
    } catch (error) {
        console.error('Admin log attendance error:', error);
        res.status(500).json({ message: "Server error while logging attendance." });
    }
};

// @desc    Get the current logged-in user's attendance records
// @route   GET /api/attendance/my-records
// @access  Private/Employee
const getMyAttendanceRecords = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ employeeId: req.user._id }).sort({ date: -1 });
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get attendance for a specific employee (Admin view)
// @route   GET /api/attendance/employee/:employeeId
// @access  Private/Admin
const getEmployeeAttendanceForAdmin = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const attendanceRecords = await Attendance.find({ employeeId }).sort({ date: -1 });

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this user.' });
        }

        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markMyAttendance,
    adminLogOrUpdateAttendance,
    getMyAttendanceRecords,
    getEmployeeAttendanceForAdmin
};
