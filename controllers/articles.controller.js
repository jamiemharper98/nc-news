const { selectArticles, selectArticleByID, updateArticleByID } = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  updateArticleByID();
};
