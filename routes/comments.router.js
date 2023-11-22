const commentRouter = require("express").Router();
const { deleteCommentByID } = require("../controllers/comments.controller");

commentRouter.route("/:comment_id").delete(deleteCommentByID);

module.exports = commentRouter;
