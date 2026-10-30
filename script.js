// 1. Select HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const filterButtons = document.querySelectorAll(".filter-btn");

// 2. Store tasks
let tasks = [];

// 3. Track the current filter
let currentFilter = "all";


// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    // Check if the input is empty
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create a task object
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add the task to the array
    tasks.push(newTask);
    
    // save the task
    saveTasks();

    // Clear the input field
    taskInput.value = "";

    // Update the screen
    renderTasks();
}

// Listen for button clicks
addTaskBtn.addEventListener("click", addTask);

// Allow adding tasks by pressing Enter
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});



function renderTasks() {

    // Clear the task list
    taskList.innerHTML = "";

    // Filter tasks
    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Show empty state
    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("li");
        emptyMessage.className = "empty-state";

        if (tasks.length === 0) {
            emptyMessage.textContent =
                "✨ No tasks yet. Add your first task!";
        } else if (currentFilter === "active") {
            emptyMessage.textContent = "🎉 No active tasks!";
        } else if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks yet.";
        }

        taskList.appendChild(emptyMessage);
    }

    // Display tasks
    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="task-content">
                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="${task.completed ? "completed" : ""}">
                    ${escapeHTML(task.text)}
                </span>
            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
                aria-label="Delete task"
                title="Delete task"
            >
                <i data-lucide="trash-2"></i>
            </button>
        `;

        taskList.appendChild(li);
    });

    // Calculate statistics
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const remaining = total - completed;

    // Update statistics cards
    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("remainingTasks").textContent = remaining;

    // Update task counter
    taskCounter.textContent = `${remaining} tasks remaining`;

    // Calculate progress
    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    // Update progress bar
    document.getElementById("completionText").textContent =
        `${progress}% completed`;

    document.getElementById("progressBar").style.width =
        `${progress}%`;
    
    lucide.createIcons();
}


// Escape user input before inserting it into HTML
function escapeHTML(text) {
    const element = document.createElement("span");
    element.textContent = text;
    return element.innerHTML;
}


// Mark a task as completed or active
function toggleTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (task) {
        task.completed = !task.completed;
    }

    renderTasks();
    saveTasks();
}


// Delete a task
function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    saveTasks();
    renderTasks();
}



filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Get the selected filter
        currentFilter = button.dataset.filter;

        // Update active button styling
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Display filtered tasks
        renderTasks();
    });

});



// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }

    renderTasks();
}

// Load saved tasks when the page opens
loadTasks();