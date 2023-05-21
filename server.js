const express = require('express');
const cors = require('cors');
const openApiValidator = require('express-openapi-validator');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));
app.use('/openapi.json', express.static(path.join(__dirname, 'openapi.json')));
app.use('/logo.png', express.static(path.join(__dirname, 'logo.png')));

const todos = {};

app.get('/todos/:username', (req, res) => {
  const { username } = req.params;
  res.json({ todos: todos[username] || [] });
});

app.post('/todos/:username', (req, res) => {
  const { username } = req.params;
  const { todo } = req.body;
  if (!todos[username]) {
    todos[username] = [];
  }
  todos[username].push(todo);
  res.json({ todos: todos[username] });
});

app.delete('/todos/:username', (req, res) => {
  const { username } = req.params;
  const { todo_idx } = req.body;
  if (todos[username] && todos[username][todo_idx]) {
    todos[username].splice(todo_idx, 1);
  }
  res.json({ todos: todos[username] || [] });
});

app.use(openApiValidator.middleware({
  apiSpec: path.join(__dirname, 'openapi.json'),
  validateRequests: true,
  validateResponses: true
}));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
