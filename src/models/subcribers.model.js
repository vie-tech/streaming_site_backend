const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
    contentCreatorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Creator",
        required: true
    },

    subscriberId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Watcher",
        required: true
    },
    subscribedAt: {
        type: Date,
        default: ()=>Date.now()
    }
})