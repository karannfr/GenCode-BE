const {format} = require('date-fns')
const {v4:uuid}  = require('uuid')
const logController = require('../controller/logController')

const logErrors = (err,req,res,next) => {
  const timestamp = format(new Date, 'dd/MM/yyyy\tHH:mm:ss')
  const id = uuid()
  const message = err.name + ' ' + err.message
  const logItem = `${timestamp}\t${id}\t${message}`
  logController(logItem,'errorLogs.txt')
  console.log(err)
  res.sendStatus(500)
}

module.exports = logErrors