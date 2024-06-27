import userRouter  from './user.route'
import guestRouter from'./guest.route'
import express from 'express'
const routes = express.Router()


routes.use('/user', userRouter)
routes.use('/guest', guestRouter)


export default routes


