const { selectArticles, selectArticleByID, updateArticleByID } = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
  const query = req.query;
  selectArticles(query)
    .then((articles) => res.status(200).send({ articles }))
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.patchArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  const toPatch = req.body;
  selectArticleByID(article_id)
    .then(() => {
      return updateArticleByID(article_id, toPatch);
    })
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};
