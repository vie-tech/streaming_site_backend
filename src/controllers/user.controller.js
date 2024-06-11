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
    
    const token = jwt.sign(
      { id: user._id, permissionToLiveStream: user.permissionToLiveStream},
      process.env.JWT_PASSKEY,
      { expiresIn: "24hr" }
    )
    if (!token) return responseHandler.invalidToken(res);
    responseHandler.created(res, {
      message: `Welcome back ${user.username}`,
      user: user.username,
      user_host_id: user.hostId
    }, token);
    
  } catch (err) {
    responseHandler.error(res);
    console.log(err)
  }
};

const getJwtTokenForUser = async (req, res) => {
  const userFromMiddleware = req.user
  if(!userFromMiddleware) return responseHandler.error(res)
    
  const { userId} = req.query;
  if (!userId) return responseHandler.error(res);

  const payload = {
    user_id: userId,
  };
  const options = {
    expiresIn: "1h",
    issuer: "my_app_url", //REPLACE THIS WITH THE APP URL
  };

  const token = jwt.sign(payload, process.env.JWT_PASSKEY, options);
  if (!token) return responseHandler.error(res);
 const user = await Channel.findOneAndUpdate({owner: userFromMiddleware.id}, {isLive: true}, {new: true})
  if(!user) return responseHandler.error(res)
    console.log(token)
  responseHandler.ok(res, { token, channelName: user.channelName });
};




module.exports = {
  userSignup,
  userLogin,
  getJwtTokenForUser
}