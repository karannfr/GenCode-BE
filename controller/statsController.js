const User = require('../model/User');
const Question = require('../model/Question');
const Submission = require('../model/Submission');

const updateStats = async (username) => {
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) throw new Error('User not found');

    const userID = user._id;
    const questions = await Question.find({ user: userID }).exec();

    let solved = 0, java = 0, python = 0, c = 0, cpp = 0;

    questions.forEach(item => {
      if (item.status === 'solved') solved++;
    });

    user.stats.totalQuestions = questions.length;
    user.stats.solvedQuestions = solved;

    const submissions = await Submission.find({ user: userID }).exec();

    submissions.forEach(item => {
      switch (item.language) {
        case 'python': python++; break;
        case 'java': java++; break;
        case 'c': c++; break;
        case 'cpp': cpp++; break;
      }
    });

    user.stats.languagesUsed = {
      C: c,
      Cpp: cpp,
      Java: java,
      Python: python
    };

    await user.save();
  } catch (err) {
    console.error(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const username = req.params.username;
    await updateStats(username);

    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json({ message: 'User stats retrieved successfully.', stats: user.stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports = getStats;
