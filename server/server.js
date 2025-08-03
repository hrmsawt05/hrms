const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // ✅ Required!

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('HRMS Server is Running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
