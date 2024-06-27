"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const guest_controller_1 = require("../controllers/guest.controller");
const router = express_1.default.Router();
router.get('/get_guestId', guest_controller_1.guestController.getTemporaryGuestId //FIRST THING WHEN A USER ENTERS AS A GUESST (creates the guest channel name)
);
router.get('/get_all_guest_live_streams', guest_controller_1.guestController.getAllGuestLiveStreams);
router.get('/get_guest_token', guest_controller_1.guestController.getJwtTokenForGuest);
router.put('/end_guest_call', guest_controller_1.guestController.endGuestHostCall);
exports.default = router;
