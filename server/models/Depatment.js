const departmentSchema = new mongoose.Schema({
    // Mapped from the SQL table's related fields
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