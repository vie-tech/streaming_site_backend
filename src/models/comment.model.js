const mongoose =require('mongoose')


const commentSchema = new mongoose.Schema({
    watcherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watcher',
        required: true
    },

    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creator',
        required: true
    },

    comment: {
        type: String,
        required: true
    }
})