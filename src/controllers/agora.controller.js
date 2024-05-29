const responseHandler = require("../handlers/response.handler");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const User = require("../models/user.model").User;
const Channel = require("../models/channel.model").Channel;
const Guest = require("../models/guest.model").Guest;
const { v4: uuidv4 } = require("uuid");
const APP_ID = process.env.AGORA_APP_ID;
const certificate = process.env.AGORA_APP_CERTIFICATE;
require("dotenv").config();

const generateTokenHost = async (req, res) => {
  try {
    const role = RtcRole.PUBLISHER;
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + (3600 * 24)
    

    const { id } = req.user;
    const { channelName } = req.query;
    const {userId} = req.query //THE CHANNEL NAME IS ALREADY MADE WITH THE HOST ID IN THE USER SIGNUP ROUTE

    if (!channelName)
      return responseHandler.badrequest(res, "Channel name was not provided");

    const user = await Channel.findOneAndUpdate(
      { owner: id },
      { isLive: true },
      { new: true }
    ).populate("owner"); //THIS IS TO ADD THE STREAMING TILE TO THE HOMEPAGE
    if (!user) return responseHandler.badrequest(res, "User not found");
    /* uid = user.owner.username; */

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
    certificate,
    channelName,
    userId,
    role,
    privilegeExpiredTs,
    );
    responseHandler.ok(res, { token, channelName });
  } catch (err) {
    responseHandler.error(res, err.message);
  }
  //TOKEN AND THE CHANNEL NAME IS SENT TO THE HOST TO USE
};

const generateTokenGuestHost = async (req, res) => {
  console.log('guest host function called')
  const role = RtcRole.PUBLISHER;
  const privilegeExpiredTs = Math.floor(Date.now() / 1000) + (3600 * 24)
  
  const { channelName } = req.query;
  const {userId} = req.query
  console.log(userId)
  console.log(channelName)
  if (!channelName)
    return responseHandler.badrequest(res, "Channel name not found try again");
  const user = await Guest.findOneAndUpdate(
    { guestChannelName: channelName },
    { isLive: true },
    { new: true }
  );
  if (!user) return responseHandler.badrequest(res, "Guest account not found");
  /* uid = `GUEST_STREAM_${user.guestId}`; */

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    certificate,
    channelName,
    userId,
    role,
    privilegeExpiredTs,
  );
  responseHandler.ok(res, { token, channelName });
};

const generateTokenAudience = async (req, res) => {
  console.log('AUDIENCE FUNCTION RUNNING')
  /* const user = req.user;
  if (!user) return responseHandler.error(res); */ //remove later
   
  const { channelName } = req.query;
  const {userId} = req.query
  if (!channelName)
    return responseHandler.badrequest(res, "Channel name was not provided");
  let uid = 0;
 /*  if (user) {
    const userFromDB = await User.findById(user.id);
    if (userFromDB) {
      
      console.log('nady')
    }
  } */
  const role = RtcRole.SUBSCRIBER;
  const privilegeExpiredTs = Math.floor(Date.now() / 1000) + (3600 * 24)
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    certificate,
    channelName,
    userId, // FIX THE USER ID DILEMMA
    role,
    privilegeExpiredTs,
    
  );
  return responseHandler.ok(res, { token });
};

module.exports = {
  generateTokenHost,
  generateTokenAudience,
  generateTokenGuestHost,
};
