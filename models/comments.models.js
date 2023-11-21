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

exports.sendCommentByArticleID = (id, { username, body }) => {
  if (!body || !username) return Promise.reject({ status: 400, msg: "Bad request - incomplete request body" });
  else {
    return selectArticleByID(id)
      .then(() => {
        return db.query(
          `
        INSERT INTO comments 
        (body,votes,author,article_id,created_at)
        VALUES
        ($1, 0, $2, $3, Now())
        RETURNING *;`,
          [body, username, id]
        );
      })
      .then(({ rows }) => rows[0]);
  }
};

exports.checkCommentBodyCorrect = ({ username, body }) => {
  if (!body || !username) return Promise.reject({ status: 400, msg: "Bad request - incomplete request body" });
  else return Promise.resolve();
};
