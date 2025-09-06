const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: { // Renamed for clarity
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the consolidated User model
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

// To prevent an employee from having two attendance records on the same day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
