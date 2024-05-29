const express = require('express')
const router = express.Router()
const agoraController = require('../controllers/agora.controller')
const tokenMiddleware = require('../middleware/token.middleware')
const cacheMiddleware = require('../middleware/nocache.middleware')


router.get(
    '/host', 
     tokenMiddleware.auth,
     agoraController.generateTokenHost 
)

router.get(
    '/audience',
    /* tokenMiddleware.auth, */
    agoraController.generateTokenAudience
)

router.get(
    '/guest_host',
    cacheMiddleware.nocache,
    agoraController.generateTokenGuestHost
)


module.exports  = {router}