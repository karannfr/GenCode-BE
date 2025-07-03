const express = require('express')
const router = express.Router()
const submissionController = require('../controller/submissionsController')

router.route('/')
.post(submissionController.makeSubmission)

router.get('/:id',submissionController.getAllSubmissions)

module.exports = router