const User = require('../model/User');
const bcrypt = require('bcrypt');

const registerController = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields (username, password, email) are required.' });
    }

    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const emailExists = await User.exists({ email });
    if (emailExists) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: 'User successfully registered.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports = registerController;
