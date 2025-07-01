const User = require('../model/User')
const Question = require('../model/Question')
const {GoogleGenAI} = require('@google/genai')
require('dotenv').config()

const generateQuestion = async(req,res,next) => {
  try{
    const {input} = req.body
    const username = req.user
    const user = await User.findOne({username: username}).exec();
    if(!user) return res.sendStatus(400)
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    if(!input) return res.sendStatus(400)
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
          },
          ...
        ],
        "solution": "Provide the full solution in Python here."
      }

      ⚠️ Do NOT include markdown formatting, headings, or explanations. Return only a valid JSON object exactly in the above format.
      `,
    })
    const data = JSON.parse(response.text);
    const id = user._id;
    const question = await Question.create(
      {title: data.title,
      promptUsed: input,
      description: data.description,
      constraints: data.constraints,
      examples: data.examples,
      testCases: data.testCases,
      solution: data.solution,
      user: id}
    )
    user.stats.totalQuestions = user.stats.totalQuestions + 1
    await user.save()
    res.status(200).json(question.id);
  }catch(err){
    next(err)
  }
}

module.exports = generateQuestion