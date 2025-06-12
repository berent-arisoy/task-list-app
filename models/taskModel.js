const db = require('../db/connection');

const Task = {
  getAll: (callback) => {
    db.query('SELECT * FROM tasks', callback);
  },

  create: (task, callback) => {
    db.query(
      'INSERT INTO tasks (description, completed) VALUES (?, ?)',
      [task.description, false],
      (err, result) => {
        if (err) return callback(err);

        // Fetch full task including createdAt
        db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId], (err2, rows) => {
          if (err2) return callback(err2);
          callback(null, rows[0]); // Return full task object
        });
      }
    );
  },


  update: (id, completed, callback) => {
    db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM tasks WHERE id = ?', [id], callback);
  },

  updateDescription: (id, description, callback) => {
  db.query('UPDATE tasks SET description = ? WHERE id = ?', [description, id], callback);
}

};

module.exports = Task;
