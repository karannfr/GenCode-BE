const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const connectDB = require('./config/connectDB')
const path = require('path')
const logEvents = require('./middleware/logEvents');
const errorLogs = require('./middleware/logErrors')
const cookieParser = require('cookie-parser')
const verifyJWT = require('./middleware/verifyJWT')
require('dotenv').config()
PORT = process.env.PORT || 3500

connectDB();

app.use(logEvents)

app.use(cookieParser())

app.use(cors(require('./config/corsOptions')))

app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }));

app.use('/',require('./routes/root'))
app.use('/register',require('./routes/register'))
app.use('/login',require('./routes/login'))
app.use('/refresh',require('./routes/refresh'))
app.use('/logout',require('./routes/logout'))
app.use('/generate',verifyJWT,require('./routes/generate'))
app.use('/question',verifyJWT,require('./routes/question'))


app.all('*',(req,res) => {
  if(req.accepts('html')) res.status(404).sendFile(path.join(__dirname,'view','404.html'))
  else if(req.accepts('json')) res.status(404).json({"Message" : "Error 404 Not Found"})
  else res.status(404).send('Message : Error 404 Not Found')
})

app.use(errorLogs)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT,console.log(`Server running on http://localhost:${PORT}`)
  );
});



