// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api';

// --- Global Handlers ---
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
} else if (document.getElementById('dashboard-container')) {
    // Listener for dashboard initialization is in dashboard.html script block
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if the dashboard is loaded before adding the listener for photo change
    const photoUploadInput = document.getElementById('profile-photo-upload');
    if (photoUploadInput) {
        photoUploadInput.addEventListener('change', handleProfilePhotoChange);
    }
});


function initializeDashboard() {
    // Display current date in the header
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
    const dateString = new Date().toLocaleDateString('en-US', dateOptions).replace(',', '');
    document.getElementById('current-date').textContent = dateString;

    // Set profile image source (placeholder in this case)
    document.getElementById('profile-avatar-large').src = "https://via.placeholder.com/100/000000/FFFFFF?text=A";

    // Call API functions
    fetchCourses(); // Populates Latest Progress
    fetchTasks();   // Populates Reminders
}

/**
 * Reads the selected image file and updates the profile picture instantly.
 */
function handleProfilePhotoChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Update the profile image source
            document.getElementById('profile-avatar-large').src = e.target.result;
            
            // NOTE: In a real application, you would send this 'e.target.result' (Base64 string)
            // or the file itself to a backend server for permanent storage.
            console.log("New profile photo selected. Ready to upload to server.");
        };
        reader.readAsDataURL(file); // Reads the file content as a Base64 string
    }
}

/**
 * Handles the login form submission.
 */
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = ''; 

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('isAuthenticated', 'true');
            window.location.href = 'dashboard.html';
        } else {
            errorMessageElement.textContent = data.message || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessageElement.textContent = 'Could not connect to the server.'; 
    }
}


/**
 * Fetches enrolled courses and displays them in the "Latest Progress" list.
 */
async function fetchCourses() {
    const progressList = document.getElementById('progress-list');
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const courses = await response.json();

        progressList.innerHTML = '';
        
        if (courses.length === 0) {
            progressList.innerHTML = '<p>No active courses found.</p>';
            return;
        }

        courses.forEach((course, index) => {
            const courseDiv = document.createElement('div');
            courseDiv.className = 'progress-item';

            const topicNumber = index % 10 + 1; 

            courseDiv.innerHTML = `
                <span class="topic-title">Topic ${topicNumber} - ${course.name}</span>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${course.progress}%;"></div>
                </div>
                <span class="progress-percent">${course.progress}%</span>
            `;
            progressList.appendChild(courseDiv);
        });

    } catch (error) {
        console.error('Error fetching courses:', error);
        progressList.innerHTML = '<p class="error-text">Failed to load course data. Check server connection.</p>';
    }
}

/**
 * Fetches upcoming tasks and displays them in the "Reminders" list.
 */
async function fetchTasks() {
    const tasksList = document.getElementById('tasks-list');
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        const tasks = await response.json();

        tasksList.innerHTML = '';

        if (tasks.length === 0) {
            tasksList.innerHTML = '<p>No upcoming reminders.</p>';
            return;
        }

        tasks.forEach(task => {
            const date = new Date(task.dueDate);
            
            // Format time (e.g., 4:00 PM -> 4pm)
            const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                             .toLowerCase()
                             .replace(':00', '')
                             .replace(' ', '');
                             
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });

            const taskDiv = document.createElement('div');
            taskDiv.className = 'reminder-item';
            
            taskDiv.innerHTML = `
                <div class="reminder-time">${time}</div>
                <div class="reminder-details">
                    <strong>${task.title}</strong>
                    <small>${day}</small>
                </div>
            `;
            tasksList.appendChild(taskDiv);
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
        tasksList.innerHTML = '<p class="error-text">Failed to load reminders data. Check server connection.</p>';
    }
}

/**
 * Handles the logout process.
 */
function handleLogout() {
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'index.html';
}