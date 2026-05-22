const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // 4.16: manual password validation (not via Mongoose, because the hash
  // is what gets stored, not the password itself)
  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }

  if (!username || username.length < 3) {
    return response
      .status(400)
      .json({ error: "username must be at least 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, name, passwordHash });
  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
