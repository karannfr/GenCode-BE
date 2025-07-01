const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/',(res,req) => {
  req.sendFile(path.join(__dirname,'..','view','index.html'))
})

module.exports = router