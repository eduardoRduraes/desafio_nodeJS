const express = require("express");
const cors = require("cors");
const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

function validateLike(request, response, next) {
  const { likes } = request.body;

  if (likes > 0) return (likes = 0);

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", validateLike, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (validate(id)) {
    return response.status(400).json({ message: "value id invalid." });
  }

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0)
    return response.status(400).json({ message: "Repository Not Found." });

  const repository = { title, url, techs };
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!validate(id)) {
    return response.status(400).json({ message: "value id invalid." });
  }

  const repositoriIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoriIndex < 0)
    return response.status(400).json({ message: "Repository Not Found." });

  repositories.splice(repositoriIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  //const repository = repositories.find((repository) => repository.id === id);

  const repositoryIndex = repositories.findIndex(
    (repositoryIndex) => repositoryIndex.id === id
  );

  const repository = repositories[repositoryIndex];

  if (repositories[repositoryIndex] === undefined)
    return response.status(400).json({ message: "Repository Not found" });

  repository.likes++;

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
