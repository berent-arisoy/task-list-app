const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'director',
  password: '12345',
  database: 'tasklist_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

module.exports = connection;
