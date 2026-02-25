'use strict';

// --- 2. DOM Elements ---
const taskInput = document.getElementById('todo-input');
const addTaskBtn = document.getElementById('add-btn');
const listContainer = document.getElementById('todo-list');
const incompletedTaskDisplay = document.getElementById('total-tasks');

// --- 3. Data State ---
const appData = {
    tasks: [], // Store task objects here
};

// --- 4. Functions ---

// Get value from input field
const getTaskInput = () => taskInput.value;

// Validate if input is not empty
const isTaskInputValid = (task) => !!task;

// Update the bottom counter by filtering the main array (Single Source of Truth)
const updateRemainderCount = () => {
    const count = appData.tasks.filter(t => !t.isCompleted).length;
    incompletedTaskDisplay.textContent = `${count} items left`;
};

// Create HTML and inject it into the DOM
const renderTask = (taskObj) => {
    const html = `
                <li class="todo-item" data-id="${taskObj.id}">
                    <div class="check-circle"></div>
                    <span class="todo-text">${taskObj.text}</span>
                    <button class="delete-btn">×</button>
                </li>`;
    listContainer.insertAdjacentHTML('afterbegin', html);
};

// --- 5. Orchestration & Event Listeners ---

const addTask = () => {
    const text = getTaskInput();
    if (isTaskInputValid(text)) {
        // Create new task object
        const newTask = {
            id: Date.now(),
            text,
            isCompleted: false
        };
        
        // Push to state and update UI
        appData.tasks.push(newTask);
        renderTask(newTask);
        
        // Reset input and update counter
        taskInput.value = '';
        updateRemainderCount();
    }
};

addTaskBtn.addEventListener('click', addTask);

// Combined Event Listener (Event Delegation)
listContainer.addEventListener('click', (e) => {
    const taskRow = e.target.closest('.todo-item');
    if (!taskRow) return; // Exit if click is not inside a task row

    const taskId = +taskRow.dataset.id;

    // Handle Delete Action
    if (e.target.classList.contains('delete-btn')) {
        // Remove from state (Array)
        appData.tasks = appData.tasks.filter(t => t.id !== taskId);
        // Remove from UI (DOM)
        taskRow.remove();
        updateRemainderCount();
    }

    // Handle Toggle Completion Action
    if (e.target.classList.contains('check-circle')) {
        const task = appData.tasks.find(t => t.id === taskId);
        if (task) {
            // Toggle boolean in state
            task.isCompleted = !task.isCompleted;
            // Toggle class in UI
            taskRow.classList.toggle('completed', task.isCompleted);
            updateRemainderCount();
        }
    }
});