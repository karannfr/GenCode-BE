const express = require('express')
const router = express.Router()
const getStats= require('../controller/statsController')

router.get('/:username', getStats)

module.exports = router