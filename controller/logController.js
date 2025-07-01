const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logController = async(logItem, fileName) => {
  if(!fs.existsSync(path.join(__dirname,'..','logs')))
    await fsPromises.mkdir(path.join(__dirname,'..','logs'))
  if(!fs.existsSync(path.join(__dirname,'..','logs',fileName)))
    await fsPromises.writeFile(path.join(__dirname,'..','logs',fileName),`${logItem}\n`)
  else
    await fsPromises.appendFile(path.join(__dirname,'..','logs',fileName),`${logItem}\n`)
}


module.exports = logController