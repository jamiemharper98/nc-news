const {
  selectArticles,
  selectArticleByID,
  updateArticleByID,
  sendArticle,
  removeArticleByID,
} = require("../models/articles.model");
const { columnNames, orderBy } = require("../db/data/greenlist/articles.greenlist");
const { selectUserByUsername } = require("../models/users.model");

exports.getArticles = (req, res, next) => {
  selectArticles(articleQuery(req.query))
    .then(({ total_count, articles }) => res.status(200).send({ total_count, articles }))
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

exports.postArticle = (req, res, next) => {
  const body = req.body;
  selectUserByUsername(body.author)
    .then(() => {
      return sendArticle(body);
    })
    .then((article) => selectArticleByID(article.article_id))
    .then((article) => res.status(201).send({ article }))
    .catch(next);
};

exports.deleteArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then(() => {
      return removeArticleByID(article_id);
    })
    .then(() => res.sendStatus(204))
    .catch(next);
};

function articleQuery(queryObj) {
  const defaultQuery = { sort_by: "created_at", order: "DESC", topic: null, limit: 10, p: 1 };

  for (const key in queryObj) {
    if (key === "sort_by") defaultQuery[key] = columnNames.includes(queryObj[key]) ? queryObj[key] : "err";
    if (key === "order")
      defaultQuery[key] = orderBy.includes(queryObj[key].toUpperCase()) ? queryObj[key].toUpperCase() : "err";
    if (key === "topic") defaultQuery[key] = queryObj[key];
    if (key === "limit") defaultQuery[key] = /\d/.test(queryObj[key]) ? queryObj[key] : queryObj[key] ? null : 10;
    if (key === "p") defaultQuery[key] = /\d/.test(queryObj[key]) ? queryObj[key] : queryObj[key] ? null : 1;
  }
  return defaultQuery;
}
