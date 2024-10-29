// Select DOM elements
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date');
const priorityButtons = document.querySelectorAll('.priority-btn');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const priorityFilterButtons = document.querySelectorAll('.filter');
const deleteConfirmationModal = document.getElementById('delete-confirmation');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');

let tasks = []; // Array to hold the task objects
let deleteTaskId = null; // ID of the task to delete

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listeners
addTaskButton.addEventListener('click', addTask);
priorityButtons.forEach(button => button.addEventListener('click', selectPriority));
filterButtons.forEach(button => button.addEventListener('click', filterTasks));
confirmDeleteButton.addEventListener('click', confirmDelete);
cancelDeleteButton.addEventListener('click', closeModal);


// Load tasks from local storage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks(tasks);
    }
}

// Add a new task
function addTask() {
    const taskValue = taskInput.value.trim();
    const dueDateValue = dueDateInput.value;
    const priorityValue = Array.from(priorityButtons).find(button => button.classList.contains('selected'));

    if (taskValue && priorityValue) {
        const newTask = {
            id: Date.now(),
            text: taskValue,
            dueDate: dueDateValue,
            priority: priorityValue.title, // Use title attribute for priority
            completed: false,
        };
        tasks.push(newTask);
        taskInput.value = '';
        dueDateInput.value = '';
        priorityButtons.forEach(button => button.classList.remove('selected')); // Deselect all priority buttons
        saveTasks();
        renderTasks(tasks);
    } else {
        alert("Please enter a task, select a due date, and choose a priority.");
    }
}

// Render tasks on the page
function renderTasks(tasksToRender) {
    taskList.innerHTML = ''; // Clear existing tasks
    tasksToRender.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.checked = task.completed;
        taskCheckbox.className = 'task-checkbox';
        taskCheckbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        taskItem.appendChild(taskCheckbox);
        taskItem.appendChild(document.createTextNode(task.text));

        if (task.dueDate) {
            const dueDateText = document.createElement('span');
            dueDateText.textContent = ` (Due: ${task.dueDate})`;
            taskItem.appendChild(dueDateText);
        }

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => openModal(task.id));

        taskItem.appendChild(deleteButton);
        if (task.completed) {
            taskItem.classList.add('completed'); // Add class if task is completed
        }
        
        taskList.appendChild(taskItem);
    });
}

// Toggle task completion status
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed; // Toggle completion status
    saveTasks();
    renderTasks(tasks);
}

// Open the delete confirmation modal
function openModal(taskId) {
    deleteTaskId = taskId; // Set the task ID to delete
    deleteConfirmationModal.style.display = 'flex'; // Show modal
}

// Confirm task deletion
function confirmDelete() {
    tasks = tasks.filter(task => task.id !== deleteTaskId); // Remove the task from the list
    saveTasks();
    renderTasks(tasks);
    closeModal(); // Close modal
}

// Close the delete confirmation modal
function closeModal() {
    deleteConfirmationModal.style.display = 'none'; // Hide modal
}

// Filter tasks based on their completion status
function filterTasks(e) {
    const filter = e.target.dataset.filter;
    let filteredTasks;

    switch (filter) {
        case 'all':
            filteredTasks = tasks;
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        case 'pending':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
    }
    renderTasks(filteredTasks); // Render the filtered tasks
}

priorityFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const priority = button.getAttribute('data-priority');
        filterTasksPriority(priority);
    });
});

function filterTasksPriority(priority) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        if (priority === 'all' || task.classList.contains(priority + '-priority')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks as a JSON string
}

// Select priority for the task
function selectPriority(e) {
    priorityButtons.forEach(button => button.classList.remove('selected')); // Remove 'selected' class from all buttons
    e.target.classList.add('selected'); // Add 'selected' class to the clicked button
}




