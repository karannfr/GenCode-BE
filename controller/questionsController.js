const Question = require('../model/Question')
const User = require('../model/User')

const getAllQuestions = async(req,res,next)  => {
  try{
    const username = req.user;
    if(!username) return res.sendStatus(401)
    const user = await User.findOne({username: username}).exec()
    if(!user) return res.sendStatus(400)
    const id = user._id
    const questions = await Question.find({user: id}).exec()
    const questionTitles = questions.map(item => {
      return {'title ': item.title, 'id' : item._id}
    })
    res.status(200).json(questionTitles)
  }catch(err){
    next(err)
  }
}

const getQuestionById = async(req,res,next) => {
  try{
    const username = req.user;
    if(!username) return res.sendStatus(401)
    const user = User.findOne({username: username}).exec()
    if(!user) return res.sendStatus(400)
    const id = req.params.id
    const question = await Question.findOne({_id: id}).exec()
    res.status(200).json(question)
  }catch(err){
    next(err)
  }
}

module.exports = {getAllQuestions, getQuestionById}