const axios = require('axios');
const Question = require('../model/Question');
const User = require('../model/User');
const Submission = require('../model/Submission');
require('dotenv').config();

const makeSubmission = async (req, res, next) => {
  try {
    const { language, code, questionID } = req.body;
    const username = req.user;

    if (!username || !language || !code || !questionID) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(401).json({ message: 'Unauthorized: User not found.' });

    const question = await Question.findById(questionID);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    const results = [];

    for (const testCase of question.testCases) {
      const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.sulu.sh/submissions',
        params: { base64_encoded: 'false', wait: 'true' },
        headers: {
          'content-type': 'application/json',
          'Authorization' : `Bearer ${process.env.SULU_API_KEY}`,
          'Accept': 'application/json',
        },
        data: {
          source_code: code,
          language_id:
            language === 'python' ? 71 :
            language === 'java' ? 62 :
            language === 'C' ? 50 : 54,
          stdin: testCase.input,
          expected_output: testCase.output
        }
      };

      const response = await axios.request(options);

      results.push({
        input: testCase.input,
        expected: testCase.output,
        stdout: response.data.stdout,
        status: response.data.status.description,
        passed: response.data.status.description === 'Accepted'
      });
    }

    const acceptance = results.every(r => r.passed === true);

    await Submission.create({
      user: user._id,
      question: question._id,
      code,
      language,
      passed: acceptance,
      testResults: results
    });

    if (acceptance) {
      question.status = 'solved';
      await question.save();
    }

    res.status(200).json({ message: 'Submission processed.', results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error during submission.' });
  }
};

const getAllSubmissions = async (req, res, next) => {
  try {
    const { questionID } = req.body;
    const username = req.user;

    if (!username || !questionID) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(401).json({ message: 'Unauthorized: User not found.' });

    const question = await Question.findById(questionID);
    if (!question) return res.status(404).json({ message: 'Question not found.' });

    const submissions = await Submission.find({ user: user._id, question: questionID });

    res.status(200).json({ message: 'Submissions retrieved.', submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error while fetching submissions.' });
  }
};

module.exports = { makeSubmission, getAllSubmissions };
