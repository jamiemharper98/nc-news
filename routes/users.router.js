const { getAllUsers } = require("../controllers/users.controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getAllUsers);

module.exports = userRouter;
