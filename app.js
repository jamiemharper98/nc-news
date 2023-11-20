const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { psqlErrors, customErrors, serverErrors } = require("./db/errors");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use("/", (req, res, next) => {
  return Promise.reject({ status: 400, msg: "Bad request" }).catch(next);
});
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
