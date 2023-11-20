const db = require("../db/connection");

exports.selectCommentsByArticleId = (id) => {
  return db
    .query(
      `SELECT * FROM comments 
  WHERE comments.article_id = $1 
  ORDER BY comments.created_at`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "No comments found!" });
      } else {
        return rows;
      }
    });
};
