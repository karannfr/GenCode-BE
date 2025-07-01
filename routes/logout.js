const express = require('express')
const router = express.Router()
const logoutController = require('../controller/logoutcontroller')

router.get('/', logoutController)

module.exports = router