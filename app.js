const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { psqlErrors, customErrors, serverErrors, wrongPath } = require("./db/errors");
const { getArticles, getArticleById, patchArticleById } = require("./controllers/articles.controller");
const { getApi } = require("./controllers/api.controller");
const { getAllUsers } = require("./controllers/users.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controller");
const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.get("/api/articles", getArticles);

app.get("/api/users", getAllUsers);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use("*", wrongPath);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
