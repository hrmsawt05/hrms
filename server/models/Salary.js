const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    
    // --- Components from Salary Structure ---
    basePay: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    insurance: { type: Number, default: 0 },
    incentives: { type: Number, default: 0 },

    
    daysInMonth: { type: Number, required: true },
    daysPresent: { type: Number, required: true },
    daysOnLeave: { type: Number, required: true }, // Paid leave
    daysAbsent: { type: Number, required: true }, // Unpaid absence
    
    perDaySalary: { type: Number, required: true },
    deductions: { type: Number, default: 0 }, // Total deductions for unpaid days

    // --- Final Calculated Salary ---
    netSalary: { type: Number, required: true },

}, { timestamps: true }); // createdAt will be our 'generatedDate'

// Ensure a user can only have one salary record per month/year
salarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });


module.exports = mongoose.model('Salary', salarySchema);

