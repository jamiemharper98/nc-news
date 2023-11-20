const { response } = require("../app");
const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectApi = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((response) => {
    return JSON.parse(response)
  });
};
