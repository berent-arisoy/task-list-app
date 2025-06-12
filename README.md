# Task List App

A simple task management web application using Node.js, Express, MySQL, and vanilla JavaScript.

## Features

- Add, edit, delete, and complete tasks
- Filter by all, active, or completed
- Dark/light mode toggle
- Responsive UI

## Setup

1. Clone the repo
2. Run `npm install`
3. Configure your MySQL database in `db/connection.js`
4. Start the server: `node server.js`

## API Routes

- `GET /api/tasks` — get all tasks
- `POST /api/tasks` — add a new task
- `PUT /api/tasks/:id` — update task description or completion
- `DELETE /api/tasks/:id` — delete a task
