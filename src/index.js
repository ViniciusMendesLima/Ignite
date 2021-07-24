const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users =[];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user){
    return response.status(404).json({error: "User don't exist!"});
  }
  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  const {name, username } = request.body;

  const userAlreadyExists = users.some((users) => users.username === username);

  if(userAlreadyExists){
    return response.status(400).json({error: "User already exists!"})
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos:[]
  });

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline }= request.body;

  const{ user } = request;

  const tasks = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(tasks);
  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {title , deadline } = request.body;
  const {id} = request.params;
  const { user } = request;


  const verifyIfExistId = user.todos.find((todo) => todo.id === id);

  if(!verifyIfExistId){
    return response.status(404).json({error: "Id don't find"})
  }

  verifyIfExistId.title = title;
  verifyIfExistId.deadline = new Date(deadline);
  
  return response.status(201).send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {id} = request.params;
  const { user } = request;


  const verifyIfExistId = user.todos.find((todo) => todo.id === id);

  if(!verifyIfExistId){
    return response.status(404).json({error: "Id don't find"})
  }

  verifyIfExistId.done = true;

  return response.status(201).send()

  
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {id} = request.params;
  const { user } = request;

  const verifyIfExistId = user.todos.find((todo) => todo.id === id);

  if(!verifyIfExistId){
    return response.status(404).json({error: "Id don't find"})
  }
  user.todos.splice(user.todos.indexOf(verifyIfExistId), 1);

  return response.status(204.).json(users);
});


//module.exports = app;
app.listen(3333);