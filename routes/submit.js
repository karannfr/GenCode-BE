const express = require('express')
const router = express.Router()
const submissionController = require('../controller/submissionsController')

router.route('/')
.get(submissionController.getAllSubmissions)
.post(submissionController.makeSubmission)

module.exports = router