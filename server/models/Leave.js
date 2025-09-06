const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    leaveType: {
        type: String,
        required: true,
    },
    employee: { // Renamed for clarity
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the consolidated User model
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reason: { // Added a field for the employee to state their reason
        type: String,
        required: true
    },
    rejectedReason: {
        type: String,
        default: null,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Approved by another User (an admin)
    },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
