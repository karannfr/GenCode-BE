const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const loginController = async(req,res,next) => {
  try{
    const {username,password} = req.body
    if(!password || !username) return res.status(400).json({"Message" : "Incomplete Fields"})
    const user = await User.findOne({username: username}).exec()
    if(!user) return res.status(401).json({"Message" : "Username does not exist"})
    const check = await bcrypt.compare(password,user.password)
    if(check){
      const accessToken = jwt.sign(
        {username: username},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30m'}
      )
      const refreshToken = jwt.sign(
        {username: username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '2d'}
      )
      user.refreshToken = refreshToken;
      await user.save()
      res.cookie("jwt",refreshToken,{httpOnly: true,maxAge: 48 * 60 * 60 * 60})
      res.status(202).json({accessToken})
    }else{
      res.status(401).json({"Message" : "Incorrect Password"})
    }
  }catch(err){
    next(err)
  }
}

module.exports = loginController