const db = require("../db/connection");

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `
  SELECT * FROM users WHERE users.username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (!rows.length) return Promise.reject({ status: 404, msg: "Username does not exist!" });
    });
};
