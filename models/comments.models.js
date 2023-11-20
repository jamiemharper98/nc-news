const db = require("../db/connection");
const { selectArticleByID } = require("./articles.model");

exports.selectCommentsByArticleId = (id) => {
  return selectArticleByID(id).then(() => {
    return db
      .query(
        `SELECT * FROM comments 
  WHERE comments.article_id = $1 
  ORDER BY comments.created_at`,
        [id]
      )
      .then(({ rows }) => rows);
  });
};
