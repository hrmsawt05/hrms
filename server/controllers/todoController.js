const Todo = require('../models/Todo');

// @desc    Get all todos for the logged-in user
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: 'desc' });
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Server error while fetching todos.' });
    }
};

// @desc    Create a new todo for the logged-in user
const createTodo = async (req, res) => {
    try {
        const { task } = req.body;
        if (!task) {
            return res.status(400).json({ message: 'Task content is required.' });
        }
        const newTodo = new Todo({
            userId: req.user._id,
            task,
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ message: 'Server error while creating todo.' });
    }
};

// @desc    Update a todo (e.g., mark as complete)
const updateTodo = async (req, res) => {
    try {
        const { isCompleted } = req.body;
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or you are not authorized.' });
        }
        todo.isCompleted = isCompleted;
        await todo.save();
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Server error while updating todo.' });
    }
};

// @desc    Delete a todo
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, userId: req.user._id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or you are not authorized.' });
        }
        await todo.deleteOne();
        res.status(200).json({ message: 'Todo deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error while deleting todo.' });
    }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
