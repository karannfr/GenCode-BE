const Question = require('../model/Question');
const User = require('../model/User');

const getAllQuestions = async (req, res, next) => {
  try {
    const username = req.user;

    if (!username) {
      return res.status(401).json({ message: 'Unauthorized: No username found in request.' });
    }

    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const questions = await Question.find({ user: user._id }).exec();
    return res.status(200).json({ message: 'Questions retrieved successfully.', questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const username = req.user;

    if (!username) {
      return res.status(401).json({ message: 'Unauthorized: No username found in request.' });
    }

    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const id = req.params.id;
    const question = await Question.findOne({ _id: id, user: user._id }).exec();

    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    return res.status(200).json({ message: 'Question retrieved successfully.', question : question });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports = { getAllQuestions, getQuestionById };
