exports.wrongPath = (req, res, next) => {
  return Promise.reject({ status: 400, msg: "Bad request" }).catch(next);
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503" || err.code === "23505") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
