const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  /**
   * Pega as propriedades recebidas pela requiseição
   */
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  /**
   * Adiciona um repository no final do array repositories.
   */
  repositories.push(repository);

  /**
   * A requisição retorna o repository adiciona.
   */
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  };

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  /**
   * Recebe a id através dos params
   */
  const { id } = request.params;

  /**
   * Busca no arry 'repositories' pela posição index que contenha o repository.id igual a id recebida.
   * Caso não encontre o valor retornado é -1
   */
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  /**
   * Verificar se o index encontrado é menor que zero, caso seja menor que zero, significa que não foi recontrado repository com a id informada.
   */
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  };

  /**
   * Remove do array o repository que o index foi encontrado;
   */
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository does not exists." });
  };

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;