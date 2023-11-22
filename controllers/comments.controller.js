const {
  selectCommentsByArticleId,
  sendCommentByArticleID,
  checkCommentBodyCorrect,
  removeCommentByID,
  updateCommentByID,
  selectCommentByID,
} = require("../models/comments.models");
const { selectUserByUsername } = require("../models/users.model");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postCommentByArticleID = (req, res, next) => {
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

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByID(comment_id)
    .then(() => res.sendStatus(204))
    .catch(next);
};

exports.patchCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  selectCommentByID(comment_id)
    .then(() => {
      return updateCommentByID(comment_id, inc_votes);
    })
    .then((comment) => res.status(200).send({ comment }))
    .catch(next);
};
