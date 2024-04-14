const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Cart = require("../models/cart");

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    const cart = new Cart({ userId: user._id });
    await cart.save();
    res.send({ message: "User Created", user });
  } catch (error) {
    res.send({ message: error.message });
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    console.log(user)
    res.send({ message: "Login Successful", user });
  } else {
    res.json(user);
  }
})

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.send({ users });
})

module.exports = router