const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { psqlErrors, customErrors, serverErrors, wrongPath } = require("./db/errors");
const { getApi } = require("./controllers/api.controller");
const app = express();

app.use(express.json());

app.get("/api", getApi)

app.get("/api/topics", getTopics);


app.use("*", wrongPath);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
