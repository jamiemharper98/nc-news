const {
  selectCommentsByArticleId,
  sendCommentByArticleID,
  checkCommentBodyCorrect,
  removeCommentByID,
} = require("../models/comments.models");
const { selectUserByUsername } = require("../models/users.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  checkCommentBodyCorrect(comment)
    .then(() => {
      return selectUserByUsername(comment.username);
    })
    .then(() => {
      return sendCommentByArticleID(article_id, comment);
    })
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByID(comment_id)
    .then(() => res.status(204).send({}))
    .catch(next);
};
