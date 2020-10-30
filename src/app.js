const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositorieId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid repositorie ID'});
  }

  return next();
}

function validateLikes(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid repositorie ID'});
  }
  
  return next();
}

app.use('/repositories/:id', validateRepositorieId);
app.use('/repositories/:id/likes', validateLikes);


// GET: Fetch backend information
app.get("/repositories", (request, response) => {

  return response.json(repositories);
  
});

// POST: Create information on the backend
app.post("/repositories", (request, response) => {

  const { title, url, techs } = request.body;

  const repositorie = {id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repositorie);

  return response.json(repositorie);

});

// PUT: Change information on the backend
app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const {title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositorieIndex < 0) {
    return response.status(400).json({error: 'Repositorie not found'}); // setando o erro caso não encontre o repositorie
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);

});

// DELETE: Delete information on the backend
app.delete("/repositories/:id", (request, response) => {
  
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0 ) {
    return response.status(400).json({error: 'Repositorie not found'});
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  const repositorie = repositories.find((repositorie) => repositorie.id === id);
  
  repositorie.likes+=1;
  return response.json(repositorie);
  
});

module.exports = app;