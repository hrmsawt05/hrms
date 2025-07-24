# 👥 MERN Stack Human Resource Management System (HRMS)

A full-stack **Human Resource Management System** (HRMS) built with the **MERN stack** — MongoDB, Express.js, React.js, and Node.js. This web application provides role-based access for Admin and Employees to manage employee data, attendance, leave requests, and salary records.

---

## 🧩 Key Features

### 👨‍💼 Admin
- Create/Edit/Delete employees
- View all employee profiles
- Approve/Reject leave requests
- View attendance and salary logs
- Generate summary reports

### 👨‍🔧 Employee
- Login and manage profile
- Apply for leave
- View leave status
- View attendance and payroll details

### 🔐 Security
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption using bcrypt

---

## 🛠 Tech Stack

| Layer     | Technology               |
|-----------|---------------------------|
| Frontend  | React.js, Tailwind CSS    |
| Backend   | Node.js, Express.js       |
| Database  | MongoDB (Mongoose ODM)    |
| Auth      | JWT, bcrypt               |
| Dev Tools | VS Code, Postman, Git     |

---

## 📂 Project Structure

```plaintext
HRMS-MERN/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Dashboard, Login, Leave, etc.
│   │   ├── App.js
│   │   └── index.js
│   └── package.json

├── server/                  # Express backend
│   ├── controllers/         # Logic for API routes
│   ├── models/              # Mongoose models (Employee, Leave)
│   ├── routes/              # API routes
│   ├── middleware/          # Auth/role middleware
│   ├── config/              # MongoDB connection
│   └── server.js
│
├── .env                     # Environment variables
├── README.md
└── package.json
