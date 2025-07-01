const express = require('express')
const router = express.Router()
const questionsController = require('../controller/questionsController')

router.get('/',questionsController.getAllQuestions)

router.get('/:id',questionsController.getQuestionById)

module.exports = router