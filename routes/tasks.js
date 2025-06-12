const express = require('express');
const router = express.Router();

const db = require('../db/connection');

// Create task
router.post('/', (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Description is required' });

  db.query('INSERT INTO tasks (description) VALUES (?)', [description], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ id: result.insertId, description });
  });
});

// Get all tasks
router.get('/', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Update task
router.put('/:id', (req, res) => {
  const { description, completed } = req.body;
  const { id } = req.params;

  db.query(
    'UPDATE tasks SET description = COALESCE(?, description), completed = COALESCE(?, completed) WHERE id = ?',
    [description, completed, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.sendStatus(200);
    }
  );
});

// Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.sendStatus(200);
  });
});

module.exports = router;
