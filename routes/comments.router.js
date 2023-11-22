const commentRouter = require("express").Router();
const { deleteCommentByID, patchCommentByID } = require("../controllers/comments.controller");

commentRouter.route("/:comment_id").delete(deleteCommentByID).patch(patchCommentByID);

module.exports = commentRouter;
