const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['admin', 'employee'],
    },
    position: { // e.g., 'Senior Developer', 'Team Lead', etc.
        type: String,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
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
}, { timestamps: true });

// Compound unique index to prevent duplicate salary structures
salaryStructureSchema.index({ role: 1, position: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);
