const User = require('../model/User');
const Question = require('../model/Question');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const generateQuestion = async (req, res, next) => {
  try {
    const { input } = req.body;
    const username = req.user;

    if (!input) {
      return res.status(400).json({ message: 'Input prompt is required.' });
    }

    const user = await User.findOne({ username }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an AI question generator. Based on the following user input, generate a competitive programming problem in JSON format only.

User prompt: ${input}

Respond ONLY with the following JSON structure:

{
  "title": "Your Title Here",
  "description": "Full problem description here.",
  "constraints": ["Constraint 1", "Constraint 2", "..."],
  "examples": [
    {
      "input": "Example input 1",
      "output": "Expected output 1",
      "explanation": "Explanation for example 1"
    },
    {
      "input": "Example input 2",
      "output": "Expected output 2",
      "explanation": "Explanation for example 2"
    }
  ],
  "testCases": [
    {
      "input": "Test input 1",
      "output": "Expected output 1"
    },
    {
      "input": "Test input 2",
      "output": "Expected output 2"
    }
  ],
  "hints": ["Hint 1", "Hint 2", "..."],
  "solution": "Provide the full solution in Python here."
}

 Strict Requirements:

DO NOT include markdown formatting, headings, or any text outside the JSON.

Ensure that ALL "examples" and "testCases" strictly match the behavior of the solution. Manually validate them or use the code to verify them internally before finalizing output.

The "solution" must be the exact Python implementation used to derive all outputs, not pseudocode or approximations.

Always include exactly 10 validated test cases in the "testCases" array.

If the input prompt is abstract, infer a clear, logical, and competitive-style problem from it.

DO NOT:

Do not hallucinate test cases or outputs.

Do not leave any example/test case or output undefined or ambiguous.

Do not print anything other than the raw JSON.

Your only job is to return a clean, correct, complete JSON object that meets all the above criteria. Now, generate the problem using the above template and validation rules.
`
    });

    let data;
    try {
      data = JSON.parse(response.text);
    } catch (parseErr) {
      return res.status(502).json({ message: 'Invalid response from AI model.' });
    }

    const newQuestion = await Question.create({
      title: data.title,
      promptUsed: input,
      description: data.description,
      constraints: data.constraints,
      examples: data.examples,
      testCases: data.testCases,
      hints: data.hints,
      solution: data.solution,
      user: user._id,
    });

    return res.status(201).json({ message: 'Question generated successfully.', id: newQuestion.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports = generateQuestion;
