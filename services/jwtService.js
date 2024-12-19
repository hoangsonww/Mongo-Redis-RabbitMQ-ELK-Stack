const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.generateToken = userId => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '48h' });
};

exports.verifyToken = token => {
  return jwt.verify(token, config.jwtSecret);
};
