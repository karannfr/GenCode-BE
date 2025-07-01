const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.sendStatus(401);

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); 
      req.user = decoded.username;
      next();
    });
  } catch (err) {
    next(err); 
  }
};

module.exports = verifyJWT;