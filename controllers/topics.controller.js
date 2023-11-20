const { selectTopics } = require("../models/topic.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then(({ rows: topics }) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
