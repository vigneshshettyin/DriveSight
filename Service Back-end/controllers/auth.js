const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
const saltRounds = 10;
const User = require("../db/schema/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).send({
        error: "Please provide all the details",
      });
    } else if (!validator.isEmail(email)) {
      return res.status(422).send({
        error: "Please provide a valid email",
      });
    } else if (password.length < 6) {
      return res.status(422).send({
        error: "Password must be at least 6 characters long",
      });
    } else {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const userCheck = await User.findOne({ email: email });

      if (!!userCheck) {
        return res.status(422).send({
          error: "User already have a account.",
        });
      }

      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      const response = await user.save();
      return res.status(201).json({
        message: "User created successfully",
        user: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        error: "Please provide all the details",
      });
    } else if (!validator.isEmail(email)) {
      return res.status(422).send({
        error: "Please provide a valid email",
      });
    } else if (password.length < 6) {
      return res.status(422).json({
        error: "Password must be at least 6 characters long",
      });
    } else {
      const userCheck = await User.findOne({ email: email });
      if (!userCheck)
        return res.status(422).json({ error: "User does not exist" });
      const check = bcrypt.compareSync(password, userCheck.password);
      if (!check) return res.status(422).json({ error: "Wrong password" });
      if (!!check) {
        const token = jwt.sign(
          {
            _id: userCheck._id,
          },
          process.env.TOKEN_SECRET
        );
        return res.status(200).json({
          token: token,
          message: "User logged in successfully!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
