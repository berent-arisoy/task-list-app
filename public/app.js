const apiUrl = 'http://localhost:3000/api/tasks';

const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addTaskBtn');
const errorDiv = document.getElementById('errorMessage');
const taskList = document.getElementById('taskList');

const filterAllBtn = document.getElementById('filterAll');
const filterActiveBtn = document.getElementById('filterActive');
const filterCompletedBtn = document.getElementById('filterCompleted');
const darkModeToggle = document.getElementById('darkModeToggle');

let currentFilter = 'all'; // 'all' | 'active' | 'completed'

document.addEventListener('DOMContentLoaded', () => {
  loadTasks(); // Automatically fetch and display tasks when the app loads
});


input.addEventListener('input', () => {
  addBtn.disabled = !input.value.trim();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  addTask();
});

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    darkModeToggle.textContent = '☀️ Light Mode';
  }
});

darkModeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

filterAllBtn.onclick = () => setFilter('all');
filterActiveBtn.onclick = () => setFilter('active');
filterCompletedBtn.onclick = () => setFilter('completed');

function setFilter(filter) {
  currentFilter = filter;

  // Update button active states and aria-pressed attributes
  [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });

  if (filter === 'all') {
    filterAllBtn.classList.add('active');
    filterAllBtn.setAttribute('aria-pressed', 'true');
  } else if (filter === 'active') {
    filterActiveBtn.classList.add('active');
    filterActiveBtn.setAttribute('aria-pressed', 'true');
  } else if (filter === 'completed') {
    filterCompletedBtn.classList.add('active');
    filterCompletedBtn.setAttribute('aria-pressed', 'true');
  }

  loadTasks();
}

function loadTasks() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(tasks => {
      taskList.innerHTML = '';
      errorDiv.textContent = '';

      // Filter tasks based on currentFilter
      let filteredTasks = tasks;
      if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
      } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
      }

      filteredTasks.forEach(task => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark task "${task.description}" as completed`);
        checkbox.onchange = () => toggleCompleted(task.id, checkbox.checked);

        const span = document.createElement('span');
        span.textContent = task.description;
        if (task.completed) {
          span.classList.add('completed');
        }

        // Format createdAt date
        const timeSpan = document.createElement('span');
        timeSpan.className = 'task-time';
        timeSpan.textContent = formatDate(task.createdAt);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.setAttribute('aria-label', `Edit task: ${task.description}`);

        editBtn.onclick = () => {
          const inputEdit = document.createElement('input');
          inputEdit.type = 'text';
          inputEdit.value = task.description;
          inputEdit.setAttribute('aria-label', 'Edit task description');
          inputEdit.style.flexGrow = '1';

          li.replaceChild(inputEdit, span);
          inputEdit.focus();

          editBtn.textContent = 'Save';

          editBtn.onclick = () => {
            const newDesc = inputEdit.value.trim();
            if (newDesc && newDesc !== task.description) {
              updateDescription(task.id, newDesc);
            } else {
              loadTasks();
            }
          };
        };

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.setAttribute('aria-label', `Delete task: ${task.description}`);
        delBtn.onclick = () => deleteTask(task.id);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(timeSpan);
        li.appendChild(editBtn);
        li.appendChild(delBtn);

        taskList.appendChild(li);
      });

      if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.style.color = '#666';
        emptyMessage.style.fontStyle = 'italic';
        emptyMessage.textContent = 'No tasks to show.';
        taskList.appendChild(emptyMessage);
      }
    })
    .catch(() => {
      errorDiv.textContent = 'Failed to load tasks. Please try again later.';
    });
}

function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return '';

  // Format: YYYY-MM-DD HH:mm (24h)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function updateDescription(id, description) {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  }).then(() => loadTasks());
}

function toggleCompleted(id, completed) {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  }).then(() => loadTasks());
}

function addTask() {
  const description = input.value.trim();

  if (!description) {
    errorDiv.textContent = 'Task description cannot be empty!';
    return;
  }

  errorDiv.textContent = '';

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  })
    .then(() => {
      input.value = '';
      addBtn.disabled = true;
      loadTasks();
    })
    .catch(() => {
      errorDiv.textContent = 'Failed to add task. Please try again.';
    });
}

function deleteTask(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  }).then(() => loadTasks());
}
