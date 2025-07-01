const User = require('../model/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const logoutController = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(200).json({ message: 'No active session.' });
    }

    const token = cookies.jwt;

    const user = await User.findOne({ refreshToken: token }).exec();
    if (!user) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
      return res.status(404).json({ message: 'User not found. Session cleared.' });
    }

    user.refreshToken = '';
    await user.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({ message: 'Logout successful.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports = logoutController;
