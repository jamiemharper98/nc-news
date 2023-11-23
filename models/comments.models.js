const db = require("../db/connection");
const { selectArticleByID } = require("./articles.model");

exports.selectCommentByID = (id) => {
  return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [id]).then(({ rows }) => {
    if (!rows.length) return Promise.reject({ status: 404, msg: "Comment does not exist!" });
  });
};

exports.selectCommentsByArticleId = (id, { limit, p }) => {
  if (!/\d/.test(+limit) || !/\d/.test(+p)) return Promise.reject({ status: 400, msg: "Bad request" });
  const offset = +limit * +p - limit;
  
  return selectArticleByID(id)
    .then(() => {
      return db.query(
        `SELECT * FROM comments 
  WHERE comments.article_id = $1 
  ORDER BY comments.created_at
  LIMIT $2 OFFSET $3`,
        [id, limit, offset]
      );
    })
    .then(({ rows }) => rows);
};

exports.sendCommentByArticleID = (id, { username, body }) => {
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
};

exports.removeCommentByID = (id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) return Promise.reject({ status: 404, msg: "Comment does not exist!" });
    });
};

exports.updateCommentByID = (id, votes) => {
  return db
    .query(
      `
  UPDATE comments 
  SET votes = votes + $1 
  WHERE comment_id = $2
  RETURNING *;`,
      [votes, id]
    )
    .then(({ rows }) => rows[0]);
};

exports.checkCommentBodyCorrect = ({ username, body }) => {
  if (!body || !username) return Promise.reject({ status: 400, msg: "Bad request - incomplete request body" });
  else return Promise.resolve();
};
