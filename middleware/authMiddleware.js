const { verifyToken } = require('../services/jwtService');

const authenticate = (req, res, next) => {
  try {
    // Extract the token from the `Authorization` header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
