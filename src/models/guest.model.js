const mongoose = require('mongoose')


const guestSchema = new mongoose.Schema({
    guestId: {
        type: String,
        required: true
    },

    isLive: {
        type: Boolean,
        default: false
    },

    guestChannelName: {
        type: String,
        required: true
    }
})


const Guest = mongoose.model('Guest', guestSchema)


module.exports = {Guest}