const db = require("../db/connection");

exports.selectArticles = ({ topic, sort_by, order, limit, p }) => {
  if (!limit || !p) return Promise.reject({ status: 400, msg: "Bad request" });
  if (sort_by === "err") return Promise.reject({ status: 400, msg: "Bad request" });
  const dbArray = [];
  let queryString = `
  SELECT (SELECT COUNT(*)::INT FROM articles ${
    topic ? ` WHERE articles.topic = $1 ` : ``
  }) as total_count, articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT as comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    dbArray.push(topic);
    queryString += ` WHERE articles.topic = $1 `;
  }

  queryString += `
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}
  LIMIT ${limit} OFFSET ${limit * p - limit}`;

  return db.query(queryString, dbArray).then(({ rows }) => {
    if (!rows.length) return Promise.reject({ status: 404, msg: "No articles found!" });
    else {
      const articlePage = {
        total_count: rows[0].total_count,
        articles: rows.map((article) => {
          const temp = { ...article };
          delete temp.total_count;
          return temp;
        }),
      };
      return articlePage;
    }
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

exports.sendArticle = (reqBody) => {
  const checkBody = checkArticleBodyComplete(reqBody);
  if (!checkBody) return Promise.reject({ status: 400, msg: "Bad request - invalid request body" });
  const { title, topic, body, author, article_img_url } = checkBody;
  const queryArr = [title, topic, author, body];

  const queryString = `
  INSERT INTO articles
  (title,topic,author,body${article_img_url ? ",article_img_url" : ""})
  VALUES
  ($1,$2,$3,$4${article_img_url ? ",$5" : ""})
  RETURNING *`;

  if (article_img_url) queryArr.push(article_img_url);

  return db.query(queryString, queryArr).then(({ rows }) => rows[0]);
};

exports.removeArticleByID = (id) => {
  return db.query(`DELETE FROM articles WHERE article_id = $1`, [id]);
};

function checkArticleBodyComplete(body) {
  const articleContents = { ...body };
  if (!body.author || !body.title || !body.body || !body.topic) {
    return null;
  }
  return articleContents;
}
