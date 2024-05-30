const Guest = require("../models/guest.model").Guest;
const responseHandler = require("../handlers/response.handler");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

const getTemporaryGuestId = (req, res) => {
  console.log("function running");
  const temporaryGuestId = uuid();
  if (!temporaryGuestId) return responseHandler.error(res);

  Guest.create({
    guestId: temporaryGuestId,
    guestChannelName: `channel_guest_${temporaryGuestId}`,
  }) //This is made for the sake of the frontend streaming list in the guest section and to generate host id for guests
    .then((user) => {
      responseHandler.ok(res, { guestId: user.guestId, callId: user.guestChannelName });
    })
    .catch((err) => {
      console.log(err.message, "stuff went wrong");
      return responseHandler.error(res, err.message);
    });
};

const getAllGuestLiveStreams = (req, res) => {
  Guest.find({ isLive: true })
    .then((guests) => {
      responseHandler.ok(res, guests);
    })
    .catch((err) => {
      responseHandler.error(res, err.message);
    });
};

const getJwtTokenForGuest = async (req, res) => {
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
 const user = await Guest.findOneAndUpdate({guestId: userId}, {isLive: true}, {new: true})
  if(!user) return responseHandler.error(res)
  responseHandler.ok(res, { token });
};

const createRoomIdForGuestHost = async (req, res) => {
  const {guestId} = req.query
  if (!guestId) responseHandler.error(res)
   const user = await Guest.findOneAndUpdate({ guestId: guestId}, {isLive: true}, {new: true})
  if(!user) return responseHandler.notfound(res)
    
};

const endGuestHostCall = async (req, res)=>{
   const {guestId} = req.query
   const user = await Guest.findOneAndUpdate({guestId: guestId}, {isLive: false}, {new: true})
   if(!user) return responseHandler.error(res)

    responseHandler.ok(res, {message: 'done'})
}

module.exports = {
  getTemporaryGuestId,
  getAllGuestLiveStreams,
  getJwtTokenForGuest,
  endGuestHostCall
};
