const express = require('express')
const router = express.Router()
const runController = require('../controller/runController')

router.post('/', runController)

module.exports = router