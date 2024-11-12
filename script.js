let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks based on filters and search query
function renderTasks(searchQuery = '', priorityFilter = '', statusFilter = '') {
  const upcomingTasksEl = document.getElementById('upcomingTasks');
  const overdueTasksEl = document.getElementById('overdueTasks');
  const completedTasksEl = document.getElementById('completedTasks');
  
  upcomingTasksEl.innerHTML = '';
  overdueTasksEl.innerHTML = '';
  completedTasksEl.innerHTML = '';

  tasks.forEach((task, index) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery);
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    const taskDueDate = new Date(task.dueDate);
    const today = new Date();
    const isOverdue = taskDueDate < today && !task.completed;
    const isUpcoming = taskDueDate >= today && !task.completed;
    const matchesStatus = (!statusFilter) || 
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'upcoming' && isUpcoming) ||
      (statusFilter === 'overdue' && isOverdue);

    if (!matchesSearch || !matchesPriority || !matchesStatus) return;

    const taskEl = document.createElement('li');
    taskEl.className = 'task-item ' + (task.completed ? 'complete' : isOverdue ? 'overdue' : '');
    taskEl.innerHTML = `
      <div class="task-content">
        <strong>${task.priority}: ${task.title}</strong> - Due: ${task.dueDate}
        <div class="actions">
          <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
      <p>${task.description}</p>
    `;

    if (task.completed) {
      completedTasksEl.appendChild(taskEl);
    } else if (isOverdue) {
      overdueTasksEl.appendChild(taskEl);
    } else {
      upcomingTasksEl.appendChild(taskEl);
    }

    taskEl.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(index));
    taskEl.querySelector('.edit-btn').addEventListener('click', () => editTask(index));
    taskEl.querySelector('.delete-btn').addEventListener('click', () => deleteTask(index));
  });
}

// Add a new task
function addTask() {
  const titleInput = document.getElementById('titleInput').value.trim();
  const descriptionInput = document.getElementById('descriptionInput').value.trim();
  const dueDateInput = document.getElementById('dueDateInput').value;
  const priorityInput = document.getElementById('priorityInput').value;

  if (titleInput && dueDateInput) {
    tasks.push({
      title: titleInput,
      description: descriptionInput,
      dueDate: dueDateInput,
      priority: priorityInput,
      completed: false
    });
    document.getElementById('titleInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('dueDateInput').value = '';
    saveTasks();
    renderTasks();
  } else {
    alert("Please fill in both the title and due date.");
  }
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Toggle completion status of a task
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Edit a task
function editTask(index) {
  const newTitle = prompt("Edit task title:", tasks[index].title);
  const newDescription = prompt("Edit task description:", tasks[index].description);
  const newDueDate = prompt("Edit due date (YYYY-MM-DD):", tasks[index].dueDate);
  const newPriority = prompt("Edit priority (High, Medium, Low):", tasks[index].priority);

  if (newTitle) tasks[index].title = newTitle;
  if (newDescription) tasks[index].description = newDescription;
  if (newDueDate) tasks[index].dueDate = newDueDate;
  if (newPriority) tasks[index].priority = newPriority;

  saveTasks();
  renderTasks();
}

// Search and filter tasks
function searchTasks() {
  const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  const priorityFilter = document.getElementById('priorityFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;
  renderTasks(searchQuery, priorityFilter, statusFilter);
}

// Event listeners
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('searchInput').addEventListener('input', searchTasks);
document.getElementById('priorityFilter').addEventListener('change', searchTasks);
document.getElementById('statusFilter').addEventListener('change', searchTasks);

// Initial render
renderTasks();
