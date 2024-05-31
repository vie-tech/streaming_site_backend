const User = require("../models/user.model.js").User;
const Channel = require("../models/channel.model.js").Channel;
const jwt = require("jsonwebtoken");
const responseHandler = require("../handlers/response.handler.js");
const {v4: uuidV4} = require('uuid')
require("dotenv").config();

const userSignup = async (req, res) => {
  console.log(req.body)
  try {
    console.log(`sign up controller called`)
    const { username, email, password, age } = req.body;
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) return responseHandler.badrequest(res, "User already exists");
    

    const user =  new User();
    const hostId = uuidV4()
    const channelName = `CHANNEL_${username}_${hostId}`
    user.username = username;
    user.email = email
    user.age = age
    user.hostId = hostId
    const hashedPassword = await user.setPassword(password);
    user.password =  hashedPassword;
    await user.save();


    Channel.create({
      owner: user._id,
      username: user.username, // for the uid in agora controller section
      channelName
    }).then(()=>{
      console.log('channel created')
    }).catch((err)=>{
      console.log(err.message)
    })


    const token = jwt.sign({ id: user._id, permissionToLiveStream: user.permissionToLiveStream }, process.env.JWT_PASSKEY, {
      expiresIn: "24hr",
    });
    if (!token) return responseHandler.invalidToken(res);


    responseHandler.created(res, {
      message: "Congratulations, you've been signed up",
      channelName,
    }, token);
  } catch (err){
   console.log(err.message)
   return responseHandler.error(res, err.message);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(email, password)
    const user = await User.findOne({ email });
    if (!user) return responseHandler.badrequest(res, "Invalid email or password");
    const validPassword = await user.validPassword(password)
    console.log(validPassword)
    if (!validPassword) return responseHandler.badrequest(res, "Invalid email or password");
    console.log('didnt reach here')
    const token = jwt.sign(
      { id: user._id, permissionToLiveStream: user.permissionToLiveStream},
      process.env.JWT_PASSKEY,
      { expiresIn: "24hr" }
    )
    if (!token) return responseHandler.invalidToken(res);
    responseHandler.created(res, {
      message: `Welcome back ${user.username}`,
    }, token);
    
  } catch (err) {
    responseHandler.error(res);
    console.log(err)
  }
};




module.exports = {
  userSignup,
  userLogin,
}