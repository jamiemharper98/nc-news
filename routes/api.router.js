const { getApi } = require("../controllers/api.controller");
const articleRouter = require("./articles.router");
const commentRouter = require("./comments.router");
const topicRouter = require("./topics.router");
const userRouter = require("./users.router");

const apiRouter = require("express").Router();

apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/", getApi);

module.exports = apiRouter;
