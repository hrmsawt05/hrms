// models/Salary.js
const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    basePay: {
        type: Number,
        required: true,
    },
    hra: {
        type: Number,
        default: 0,
    },
    insurance: {
        type: Number,
        default: 0,
    },
    incentives: {
        type: Number,
        default: 0,
    },
    netSalary: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    calculatedDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);
