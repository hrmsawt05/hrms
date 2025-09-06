const mongoose = require('mongoose');
// Corrected the filename from Depatment.js to Department.js

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('Department', departmentSchema);
