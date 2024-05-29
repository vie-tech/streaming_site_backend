const Guest = require('../models/guest.model').Guest
const responseHandler = require('../handlers/response.handler')
const {v4: uuid} = require('uuid')


const getTemporaryGuestId = (req, res)=>{ 
   console.log('function running')
   const temporaryGuestId = uuid()
   console.log(temporaryGuestId)
   if(!temporaryGuestId) return responseHandler.error(res)
   
   Guest.create({guestId: temporaryGuestId, guestChannelName: `channel_guest_${temporaryGuestId}`}) //This is made for the sake of the frontend streaming list in the guest section and to generate host id for guests
   .then((user)=>{
    responseHandler.ok(res, {channelName: user.guestChannelName})
   })
   .catch((err)=>{
      console.log(err.message, 'stuff went wrong')
      return responseHandler.error(res, err.message)
   })
}


const getAllGuestLiveStreams = (req, res)=>{
   Guest.find({isLive: true})
  .then((guests)=>{
     responseHandler.ok(res, guests)
   }).catch((err)=>{
     responseHandler.error(res, err.message)
   })
}

module.exports = {getTemporaryGuestId, getAllGuestLiveStreams}