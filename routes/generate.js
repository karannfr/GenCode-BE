const express = require('express')
const router = express.Router()
const generateQuestion = require('../controller/generateQuestion')

router.post('/', generateQuestion)

module.exports = router