const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');

const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tasks', taskRoutes); // Mount routes

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
