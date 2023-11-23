const { selectTopics, createTopic } = require("../models/topics.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then(({ rows: topics }) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopics = (req, res, next) => {
  createTopic(req.body)
    .then((topic) => res.status(201).send({ topic }))
    .catch(next);
};
