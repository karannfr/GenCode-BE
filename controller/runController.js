const axios = require('axios');
const Question = require('../model/Question');
const User = require('../model/User');
require('dotenv').config();

const runController = async (req, res, next) => {
  try {
    const { language, code, questionID } = req.body;
    const username = req.user;

    // Input validation
    if (!username || !language || !code || !questionID) {
      return res.status(400).json({ message: 'Missing required fields: username, language, code, or questionID.' });
    }

    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    const question = await Question.findById(questionID).exec();
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    const results = [];

    for (const testCase of question.testCases) {
      const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
          base64_encoded: 'false',
          wait: 'true',
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        data: {
          source_code: code,
          language_id:
            language === 'python'
              ? 71
              : language === 'java'
              ? 62
              : language === 'C'
              ? 50
              : 54,
          stdin: testCase.input,
          expected_output: testCase.output,
        },
      };

      const response = await axios.request(options);

      results.push({
        input: testCase.input,
        expected: testCase.output,
        stdout: response.data.stdout,
        status: response.data.status.description,
        passed: response.data.status.description === 'Accepted',
      });
    }

    return res.status(200).json({
      message: 'Code executed successfully.',
      results,
    });
  } catch (err) {
    console.error('Execution error:', err);
    return res.status(500).json({ message: 'Internal Server Error during code execution.' });
  }
};

module.exports = runController;
