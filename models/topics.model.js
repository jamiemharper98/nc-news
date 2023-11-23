const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`);
};

exports.createTopic = ({ slug, description }) => {
  if (!description) return Promise.reject({ status: 400, msg: "Bad request" });
  return db
    .query(
      `
  INSERT INTO topics
  (slug,description)
  VALUES
  ($1,$2)
  RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => rows[0]);
};
