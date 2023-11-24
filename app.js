const express = require("express");
const cors = require("cors");
const { psqlErrors, customErrors, serverErrors, wrongPath } = require("./db/errors");
const apiRouter = require("./routes/api.router");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.use("/api", apiRouter);

app.use("*", wrongPath);
app.use(psqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
