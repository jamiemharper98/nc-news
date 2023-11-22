const { selectArticles, selectArticleByID, updateArticleByID } = require("../models/articles.model");
const { columnNames, orderBy } = require("../db/data/greenlist/articles.greenlist");

exports.getArticles = (req, res, next) => {
  selectArticles(articleQuery(req.query))
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

function articleQuery(queryObj) {
  const defaultQuery = { sort_by: "created_at", order: "DESC", topic: null };

  for (const key in queryObj) {
    if (key === "sort_by") defaultQuery[key] = columnNames.includes(queryObj[key]) ? queryObj[key] : "created_at";
    if (key === "order")
      defaultQuery[key] = orderBy.includes(queryObj[key].toUpperCase()) ? queryObj[key].toUpperCase() : "DESC";
    if (key === "topic") defaultQuery[key] = queryObj[key];
  }
  return defaultQuery;
}
