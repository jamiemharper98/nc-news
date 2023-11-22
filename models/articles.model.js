const db = require("../db/connection");

exports.selectArticles = ({ topic, sort_by, order }) => {
  const dbArray = [];
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT as comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    dbArray.push(topic);
    queryString += ` WHERE articles.topic = $1 `;
  }

  queryString += `
  GROUP BY articles.article_id
  ORDER BY articles.${sort_by} ${order}`;

  return db.query(queryString, dbArray).then(({ rows }) => {
    if (!rows.length) return Promise.reject({ status: 404, msg: "No articles found!" });
    return rows;
  });
};

exports.selectArticleByID = (id) => {
  return db
    .query(
      `
  SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article ID does not exist!" });
      } else {
        return rows[0];
      }
    });
};

exports.updateArticleByID = (id, { inc_votes }) => {
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *`,
      [id, inc_votes]
    )
    .then(({ rows }) => rows[0]);
};
