const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed: User not found' });
    }
    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      
      const userRole = req.user.role; 
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
      }
      next(); 
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { authMiddleware, roleMiddleware };
