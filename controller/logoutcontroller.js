const User = require('../model/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const logoutController = async(req,res,next) => {
  try{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(200)
    const token = cookies.jwt
    const user = await User.findOne({refreshToken: token}).exec()
    if(!user) return res.sendStatus(401)
    res.clearCookie('jwt');
    user.refreshToken = '';
    await user.save()
    res.sendStatus(200);
  }catch(err){
    next(err)
  }
}

module.exports = logoutController