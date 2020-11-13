const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { jwtSecret } = require("./secrets.js");
const { isValid } = require("./usersService");
const Users = require("./userModel");

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hashed = bcrypt.hashSync(credentials.password, rounds);

    credentials.password = hashed;
    Users.add(credentials)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username })
      .then((user) => {
        if (user && bcrypt.compare(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ message: "Successful login", token });
        } else {
          res.status(401).json({ message: "Bad credentials" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res
      .status(401)
      .json({
        message:
          "please provide username and password and the password should be alphanumeric",
      });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "60 seconds",
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
