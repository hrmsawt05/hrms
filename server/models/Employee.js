// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    experience: {
        type: Number,
        default: 0,
    },
    passportNumber: {
        type: String,
        required: false,
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    profileImagePath: {
        type: String,
        required: false,
    },
    availableLeaves: {
        type: Number,
        default: 30,
    },
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
