const {
  getArticles,
  getArticleByID,
  patchArticleByID,
  postArticle,
  deleteArticleByID,
} = require("../controllers/articles.controller");
const { getCommentsByArticleID, postCommentByArticleID } = require("../controllers/comments.controller");

const articleRouter = require("express").Router();

articleRouter.route("/:article_id/comments").get(getCommentsByArticleID).post(postCommentByArticleID);
articleRouter.route("/:article_id").get(getArticleByID).patch(patchArticleByID).delete(deleteArticleByID);
articleRouter.route("/").get(getArticles).post(postArticle);

module.exports = articleRouter;
