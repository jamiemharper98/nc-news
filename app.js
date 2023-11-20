const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { psqlErrors, customErrors, serverErrors, wrongPath } = require("./db/errors");
const { getArticles } = require("./controllers/articles.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.use("*", wrongPath);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
