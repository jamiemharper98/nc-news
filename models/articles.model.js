const db = require("../db/connection");

exports.selectArticleByID = (id) => {
  return db.query(`SELECT * FROM articles WHERE articles.article_id = $1`, [id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article ID does not exist!" });
    } else {
      return rows[0];
    }
  });
};
