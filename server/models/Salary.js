const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    employee: { // Renamed for clarity
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the consolidated User model
        required: true,
    },
    basePay: {
        type: Number,
        required: true,
    },
    hra: { // House Rent Allowance
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
    deductions: { // Added for things like unpaid leave
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        // This will be calculated automatically by the pre-save hook
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
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


// Pre-save hook to calculate netSalary automatically
salarySchema.pre('save', function(next) {
    if (this.isModified('basePay') || this.isModified('hra') || this.isModified('insurance') || this.isModified('incentives') || this.isModified('deductions')) {
        this.netSalary = (this.basePay + this.hra + this.incentives) - (this.insurance + this.deductions);
    }
    next();
});

module.exports = mongoose.model('Salary', salarySchema);
