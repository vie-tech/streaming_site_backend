const mongoose = require('mongoose')

const channelSchema = new mongoose.Schema({
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
},

  isLive: {
    type: Boolean,
    default: false
  },

  channelName: {
    type: String,
    required: true
  }
})


const Channel = mongoose.model('Channel', channelSchema)
module.exports = {Channel}