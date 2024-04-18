const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Cart = require("../models/cart");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (isExist) return res.send({ message: "User with this email already exist" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
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
  if (user == null) {
    res.send({ message: "User not found" });
  }
  try {
    if (bcrypt.compare(password, user.password)) {
      const token = jwt.sign({email: user.email}, process.env.JWT_SECRET);
      res.json({ token: token });
    } else {
      res.status(401).json({ message: "Invalid password" });
  }} catch (error) {
    res.status(401).json({ message: error.message });
  }
})

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.send({ users });
})

module.exports = router