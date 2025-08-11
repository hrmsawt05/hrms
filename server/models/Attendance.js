// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model for authentication
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day', 'on-leave'], // Defines valid attendance statuses
        required: true,
    },
    notes: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
