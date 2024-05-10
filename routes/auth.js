const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Cart = require("../models/cart");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { roleMiddleware, authMiddleware } = require('../middleware/isAuth');
require('dotenv').config()


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
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    res.json({ email: email, role: user.role, token: token });
  } catch (error) {
    res.send({ message: error.message });
  }
})

router.get('/admin', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    res.json({ message: 'Welcome, admin!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router