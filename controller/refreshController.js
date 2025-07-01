const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshController = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(401).json({ message: 'Unauthorized: No refresh token provided.' });
    }

    const token = cookies.jwt;

    const user = await User.findOne({ refreshToken: token }).exec();
    if (!user) {
      return res.status(403).json({ message: 'Forbidden: Invalid refresh token.' });
    }

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.username !== user.username) {
          return res.status(403).json({ message: 'Forbidden: Token verification failed.' });
        }

        const accessToken = jwt.sign(
          { username: user.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '30m' }
        );

        return res.status(200).json({
          message: 'Access token refreshed successfully.',
          accessToken
        });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports = refreshController;
