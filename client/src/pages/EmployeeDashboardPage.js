import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
// ⭐ 1. Import the new 'clockIn' function
import { getMyAttendanceRecords, getTodos, createTodo, updateTodo, deleteTodo, clockIn } from '../api/employeeService';
import { Plus, Calendar as CalendarIcon, ClipboardList, Pen, X, Clock as ClockIcon, AlertTriangle, CheckCircle } from 'lucide-react';

// --- Reusable Components ---
const Clock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);
    return <div className="text-lg font-semibold text-gray-700">{time.toLocaleTimeString('en-IN')}</div>;
};

// --- Main Dashboard Component ---
const EmployeeDashboardPage = () => {
    const { user } = useAuth();
    return (
        <div className="animate-fadeIn space-y-8">
            <Header user={user} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* ⭐ 2. Add the new TimeClock component to the layout */}
                    <TimeClock />
                    <NoticeBoard />
                </div>
                <div className="space-y-8">
                    <MotivationalQuote />
                    <AttendanceCalendar />
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components for the Dashboard ---
const Header = ({ user }) => (
    <div>
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-gray-800">
                Welcome, {user?.firstName || 'Faculty Member'}!
            </h1>
            <Clock />
        </div>
        <p className="text-gray-500 mt-2">Have a great work day.</p>
    </div>
);

const MotivationalQuote = () => {
    const quotes = useMemo(() => [
        { emoji: '🌟', text: 'The secret of getting ahead is getting started.' },
        { emoji: '🚀', text: 'The best way to predict the future is to create it.' },
        { emoji: '💡', text: 'An investment in knowledge pays the best interest.' },
    ], []);

    const [quote, setQuote] = useState({ emoji: '', text: '' });

    useEffect(() => {
        const sessionQuote = sessionStorage.getItem('dailyQuote');
        if (sessionQuote) {
            setQuote(JSON.parse(sessionQuote));
        } else {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setQuote(randomQuote);
            sessionStorage.setItem('dailyQuote', JSON.stringify(randomQuote));
        }
    }, [quotes]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-teal-500">
            <h3 className="font-bold text-lg text-gray-700 mb-4 flex items-center"><ClipboardList size={20} className="mr-2"/>Thought of the Day</h3>
            <div className="text-center py-4">
                <div className="text-5xl mb-4">{quote.emoji}</div>
                <p className="text-gray-600 italic">"{quote.text}"</p>
            </div>
        </div>
    );
};

// ⭐ 3. NEW: The TimeClock component with all the "Clock In" logic
const TimeClock = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    const checkTodaysAttendance = async () => {
        try {
            const records = await getMyAttendanceRecords();
            const today = new Date().toDateString();
            const todaysRecord = records.find(r => new Date(r.date).toDateString() === today);
            if (todaysRecord) {
                setIsClockedIn(true);
            }
        } catch (error) {
            console.error("Could not check today's attendance status.", error);
        } finally {
            setIsCheckingStatus(false);
        }
    };
    
    useEffect(() => {
        checkTodaysAttendance();
    }, []);

    const handleClockIn = async () => {
        setLoading(true);
        setMessage('');
        setIsError(false);
        try {
            const response = await clockIn();
            setMessage(response.message || "Successfully clocked in!");
            setIsClockedIn(true);
            setIsError(false);
        } catch (error) {
            setMessage(error.message || "An error occurred.");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };
    
     return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border">
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Daily Time Clock</h3>
            <p className="text-gray-500 mb-6">Today is {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>

            {message && (
                <div className={`flex items-center p-4 mb-6 rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {isError ? <AlertTriangle size={20} className="mr-2"/> : <CheckCircle size={20} className="mr-2"/>}
                    {message}
                </div>
            )}

            {isCheckingStatus ? (
                 <div className="text-center text-gray-500">Checking attendance status...</div>
            ) : isClockedIn ? (
                <div className="flex items-center p-4 rounded-lg bg-gray-100 text-gray-600 font-semibold">
                   <ClockIcon size={20} className="mr-2 text-gray-500" /> You are clocked in for today. Clock-out is automatic on logout.
                </div>
            ) : (
                <button
                    onClick={handleClockIn}
                    disabled={loading}
                    className="w-full max-w-xs bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 transition-transform hover:scale-105 disabled:bg-blue-300"
                >
                    {loading ? 'Clocking In...' : 'Clock In for Today'}
                </button>
            )}
        </div>
     );
};


const AttendanceCalendar = () => {
    const [records, setRecords] = useState([]);
    const [date] = useState(new Date());

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const data = await getMyAttendanceRecords();
                setRecords(data);
            } catch (err) {
                console.error(err.message);
            }
        };
        fetchRecords();
    }, []);

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getStatusForDay = (day) => {
        const recordDate = new Date(date.getFullYear(), date.getMonth(), day);
        const record = records.find(r => new Date(r.date).toDateString() === recordDate.toDateString());
        return record ? record.status : 'unknown';
    };

    const getTileColor = (day) => {
        const status = getStatusForDay(day);
        const dayOfWeek = new Date(date.getFullYear(), date.getMonth(), day).getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) return 'bg-gray-200 text-gray-500'; // Weekend/Holiday

        switch (status) {
            case 'present': return 'bg-green-400 text-white';
            case 'half-day': return 'bg-yellow-400 text-white';
            case 'on-leave': return 'bg-blue-400 text-white';
            case 'absent': return 'bg-red-400 text-white';
            case 'in-progress': return 'bg-purple-400 text-white';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg text-gray-700 mb-4 flex items-center"><CalendarIcon size={20} className="mr-2"/>Monthly Attendance View</h3>
             <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-500 mb-2">
                {weekdays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {days.map(day => (
                    <div key={day} className={`p-2 rounded-lg text-center font-bold transition-transform hover:scale-110 ${getTileColor(day)}`}>
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};


const NoticeBoard = () => {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const fetchTodos = async () => {
            const data = await getTodos();
            setTodos(data);
        };
        fetchTodos();
    }, []);

    const handleAddTodo = async () => {
        if (!newTask.trim()) return;
        try {
            const newTodo = await createTodo({ task: newTask });
            setTodos([newTodo, ...todos]);
            setNewTask('');
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };

    const handleToggleTodo = async (id, isCompleted) => {
        try {
            const updatedTodo = await updateTodo(id, { isCompleted: !isCompleted });
            setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };
    
    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
             <h3 className="font-bold text-lg text-gray-700 mb-4 flex items-center"><Pen size={20} className="mr-2"/>My Notice Board</h3>
             <div className="flex space-x-2 mb-4">
                <input 
                    type="text" 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
                    placeholder="Add a new task or reminder..."
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleAddTodo} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"><Plus/></button>
            </div>
            <ul className="space-y-2">
                {todos.map(todo => (
                    <li key={todo._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                        <div className="flex items-center">
                            <input 
                                type="checkbox"
                                checked={todo.isCompleted}
                                onChange={() => handleToggleTodo(todo._id, todo.isCompleted)}
                                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className={`ml-3 ${todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>{todo.task}</span>
                        </div>
                        <button onClick={() => handleDeleteTodo(todo._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={18}/></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeDashboardPage;

