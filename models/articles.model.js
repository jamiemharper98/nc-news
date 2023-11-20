const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      `
  SELECT articles.*, COUNT(comments.comment_id)::INT as comment_count
  FROM articles
  JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      const articles = [...rows];
      articles.forEach((article) => delete article.body);
      return articles;
    });
};
