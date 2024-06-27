import express from 'express'
import {guestController} from '../controllers/guest.controller'


const router = express.Router()


router.get(
    '/get_guestId',
     guestController.getTemporaryGuestId  //FIRST THING WHEN A USER ENTERS AS A GUESST (creates the guest channel name)
) 


router.get(
    '/get_all_guest_live_streams',
    guestController.getAllGuestLiveStreams
)

router.get(
    '/get_guest_token',
    guestController.getJwtTokenForGuest
)

router.put(
    '/end_guest_call',
    guestController.endGuestHostCall
)

export default router