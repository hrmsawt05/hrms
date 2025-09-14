const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    task: {
        type: String,
        required: true,
        trim: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Add an index for faster queries by user
todoSchema.index({ userId: 1 });

module.exports = mongoose.model('Todo', todoSchema);
