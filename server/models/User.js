const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // --- Consolidated Fields ---
    employeeIdString: { // For display or HR systems, if different from the database ID.
        type: String,
        required: true,
        unique: true,
    },
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
        lowercase: true, // Good practice to store emails in a consistent format
    },
    password: {
        type: String,
        required: true,
        select: false, // Prevents the password from being sent back in queries by default
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee',
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    experience: {
        type: Number,
        default: 0,
    },
    dateOfJoining: {
        type: Date,
        default: Date.now,
    },
    availableLeaves: {
        type: Number,
        default: 30, // Or whatever your company policy is
    },
    profileImagePath: {
        type: String,
        default: null,
    },
    passportNumber: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
    // Add a virtual property to get the full name
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for user's full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName || ''}`.trim();
});


// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
