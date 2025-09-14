const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    
    loginTime: {
        type: Date,
    },
    logoutTime: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day', 'on-leave', 'in-progress'],
        required: true,
        default: 'in-progress', // Default status when clocked in
    },
    notes: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

// Ensure an employee can only have one record per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

