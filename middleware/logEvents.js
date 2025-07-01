const {format} = require('date-fns')
const {v4:uuid}  = require('uuid')
const logController = require('../controller/logController')

const logEvents = (req,res,next) => {
  const timestamp = format(new Date, 'dd/MM/yyyy\tHH:mm:ss')
  const id = uuid()
  const message = req.url + ' ' + req.method
  const logItem = `${timestamp}\t${id}\t${message}`
  logController(logItem,'eventLogs.txt')
  next()
}

module.exports = logEvents