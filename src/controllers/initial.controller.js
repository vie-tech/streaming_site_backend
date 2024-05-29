const Channel = require('../models/channel.model').Channel
const Guest = require('../models/guest.model').Guest
const responseHandler = require('../handlers/response.handler')



const getAllLiveStreams = (req, res)=>{
  Channel.find({isLive: true}).populate('owner') //ADDED THE OWNER SO THAT I CAN PUT THE STREAM OWNER'S NAME IN THE UI
  .then((channels)=>{
    responseHandler.ok(res, channels)
  }).catch((err)=>{
    responseHandler.error(res, err.message)
  })
}



module.exports = {getAllLiveStreams}