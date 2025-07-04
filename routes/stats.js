const express = require('express')
const router = express.Router()
const getStats= require('../controller/statsController')

router.get('/', getStats)

module.exports = router