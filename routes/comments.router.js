const commentRouter = require("express").Router();
const { deleteCommentByID, patchCommentByID, getAllComments } = require("../controllers/comments.controller");

commentRouter.route("/:comment_id").delete(deleteCommentByID).patch(patchCommentByID);
commentRouter.route("/").get(getAllComments);

module.exports = commentRouter;
