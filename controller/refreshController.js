const User = require('../model/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const refreshController = async(req,res,next) => {
  try{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    const token = cookies.jwt
    const user = await User.findOne({refreshToken: token}).exec()
    if(!user) return res.sendStatus(401)
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      (err,decoded) => {
        if(err || decoded.username != user.username)
          return res.sendStatus(401)
        else{
          const accessToken = jwt.sign(
              {username: user.username},
              process.env.ACCESS_TOKEN_SECRET,
              {expiresIn: '30m'}
            )
          res.status(200).json({accessToken})
        }
      }
    )
  }catch(err){
    next(err)
  }
}

module.exports = refreshController