const { getAllUsers, getUserByUsername } = require("../controllers/users.controller");

const userRouter = require("express").Router();

userRouter.route("/:username").get(getUserByUsername);
userRouter.route("/").get(getAllUsers);

module.exports = userRouter;
