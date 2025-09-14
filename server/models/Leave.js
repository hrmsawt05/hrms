const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    leaveType: {
        type: String,
        enum: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Conference', 'Exam Duty'],
        required: true,
    },
    fromDate: { 
        type: Date, 
        required: true 
    },
    toDate: { 
        type: Date, 
        required: true 
    },
    
    reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    // This will be calculated on the backend
    numberOfDays: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    rejectedReason: {
        type: String,
        default: null,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);

