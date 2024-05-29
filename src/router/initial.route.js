const initialController = require('../controllers/initial.controller');
const responseHandler = require('../handlers/response.handler')
const express = require('express')
const router = express.Router()


router.get(
    '/get_live_streams',
    initialController.getAllLiveStreams
)




module.exports = {router}