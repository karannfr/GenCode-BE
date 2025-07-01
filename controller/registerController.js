const User = require('../model/User')
const bcrypt = require('bcrypt')

const registerController = async(req,res,next) => {
  try{
    const {username,password,email} = req.body
    if(!username || !password || !email) return res.status(400).json({"Message" : "Incomplete Fields"})
    if( await User.exists({username: username})) return res.status(409).json({"Message" : "Username already exists"})
    if( await User.exists({email: email})) return res.status(409).json({"Message" : "Email already exists"})
    const hashedPassword = await bcrypt.hash(password,10)
    await User.create({
      username: username,
      email: email,
      password: hashedPassword
    })
    res.status(201).json({"Message" : "User Succesfully Registered"})
  }catch(err){
    next(err)
  }
}

module.exports = registerController