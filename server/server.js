const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes'); 
const leaveRoutes = require('./routes/leaveRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const salaryStructureRoutes = require('./routes/salaryStructureRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const departmentRoutes = require('./routes/departmentRoutes'); 

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes); 
app.use('/api/leaves', leaveRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/salary-structures', salaryStructureRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/departments', departmentRoutes); 

// Default route
app.get('/', (req, res) => {
  res.send('HRMS Server is Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
