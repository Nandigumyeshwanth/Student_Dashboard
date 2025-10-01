const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3000;

// Middleware setup
app.use(cors()); 
app.use(express.json());

// --- Dummy Data (Courses and Tasks) ---
const enrolledCourses = [
    { id: 1, name: 'HTML', instructor: 'J. Doe', progress: 18 },
    { id: 2, name: 'CSS', instructor: 'M. Chen', progress: 10 },
    { id: 3, name: 'Javascript', instructor: 'A. Smith', progress: 35 },
    { id: 4, name: 'Python', instructor: 'L. King', progress: 10 },
    { id: 5, name: 'Bootstrap', instructor: 'T. Jones', progress: 45 },
    { id: 6, name: 'React', instructor: 'R. Davis', progress: 41 }
];

const upcomingTasks = [
    // Times are UTC 
    { id: 101, title: 'Python test', course: 'Python', dueDate: '2025-10-08T16:00:00Z' }, 
    { id: 102, title: 'Bootstrap test', course: 'Bootstrap', dueDate: '2025-10-09T10:00:00Z' }, 
    { id: 103, title: 'React test', course: 'React', dueDate: '2025-10-10T14:00:00Z' } 
];

// --- Login Handler ---
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'student' && password === 'password') {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

// --- API Endpoints ---
app.get('/api/courses', (req, res) => {
    res.json(enrolledCourses);
});

app.get('/api/tasks', (req, res) => {
    res.json(upcomingTasks);
});

// Start the server
app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});