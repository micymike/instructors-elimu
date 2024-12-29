const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).send({ message: 'No token provided', error: 'Unauthorized', statusCode: 401 });

  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).send({ message: 'No token provided', error: 'Unauthorized', statusCode: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    console.error('Token validation error:', ex.message); // Add this line for logging
    res.status(401).send({ message: 'Invalid or expired token', error: 'Unauthorized', statusCode: 401 });
  }
};
