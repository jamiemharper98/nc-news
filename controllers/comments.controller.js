const { selectCommentsByArticleId, sendCommentByArticleID } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;
  sendCommentByArticleID(article_id, comment)
    .then((comment) => res.status(201).send({ comment }))
    .catch(next);
};
