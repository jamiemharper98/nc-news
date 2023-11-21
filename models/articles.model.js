const db = require("../db/connection");

exports.selectArticles = ({ topic }) => {
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
  ORDER BY articles.created_at DESC`;

  return db.query(queryString, dbArray).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleByID = (id) => {
  return db.query(`SELECT * FROM articles WHERE articles.article_id = $1`, [id]).then(({ rows }) => {
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
