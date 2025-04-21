// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized');
      }
    } catch (error) {
      console.error('Token verification failed');
      res.status(401).json({ message: 'Not authorized, token failed' });

    }
  } else {
    res.status(401);
    res.status(401).json({ message: 'Not authorized, no token' });

  }
};

module.exports = { protect };
