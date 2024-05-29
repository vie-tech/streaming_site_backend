const userRouter = require('./user.route').router
const agoraRouter = require('./agora.route').router
const guestRouter = require('./guest.route').router
const initialRouter = require('./initial.route').router
const express = require('express')
const routes = express.Router()


routes.use('/user', userRouter)
routes.use('/stream', agoraRouter)
routes.use('/guest', guestRouter)
routes.use('/initial', initialRouter)


module.exports = {routes}