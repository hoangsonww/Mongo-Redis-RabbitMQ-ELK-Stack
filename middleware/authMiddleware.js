const { verifyToken } = require('../services/jwtService');
const redisClient = require('../services/redisService');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Decode the token
    const decoded = verifyToken(token);

    // Check if the user's tokens are blacklisted
    const blacklistKey = `blacklist:${decoded.id}`;
    const isBlacklisted = await redisClient.get(blacklistKey);

    if (isBlacklisted) {
      return res.status(401).json({ error: 'Unauthorized: Token invalidated. Please login again.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
