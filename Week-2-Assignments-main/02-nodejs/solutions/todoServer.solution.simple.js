const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// The cors package simplifies handling CORS in your Node.js server. It adds the necessary headers to responses to allow cross-origin requests.
const cors = require('cors');
const app = express();

app.use(bodyParser.json()); //app.use(cors()) adds the Access-Control-Allow-Origin: * header to all responses, allowing any domain to access your server.
app.use(cors())

// You can restrict it to specific domains (e.g., http://localhost:3000) for better security.
// app.use(cors({
//   origin: 'http://localhost:3000'
// }));
/* 
Frontend Sends a Request: Your frontend (e.g., JavaScript running in the browser) sends a request to a server (e.g., your Node.js backend).
For example:
fetch('http://localhost:5000/api/data');

Browser Adds an Origin Header: The browser automatically adds an Origin header to the request, indicating where the request is coming from (e.g., http://localhost:3000).

Server Responds: The server processes the request and sends a response back to the browser.

Browser Checks the Response Headers: The browser checks if the response includes the Access-Control-Allow-Origin header. If the header is missing or does not match the requesting origin, the browser blocks the response and throws a CORS error.
*/
 

let todos = [];

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.get('/todos/:id', (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    res.json(todos[todoIndex]);
  }
});

app.post('/todos', (req, res) => {
  const newTodo = {
    id: Math.floor(Math.random() * 1000000), // unique random id
    title: req.body.title,
    description: req.body.description
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos[todoIndex].title = req.body.title;
    todos[todoIndex].description = req.body.description;
    res.json(todos[todoIndex]);
  }
});

app.delete('/todos/:id', (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos = removeAtIndex(todos, todoIndex);
    res.status(200).send();
  }
});


// The browser sends a request to http://localhost:3000/.
// The server receives the request and triggers the app.get('/', ...) route.
// The server sends the index.html file as the response.
// The browser receives the index.html file and renders it as a webpage.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
}); 


app.listen(3000, () => {
  console.log("Server is running on 3000... ");
})


