"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const user_controller_js_1 = require("../controllers/user.controller.js");
const express_1 = __importDefault(require("express"));
const token_middleware_js_1 = require("../middleware/token.middleware.js");
const request_handler_js_1 = require("../handlers/request.handler.js");
const router = express_1.default.Router();
router.post('/signup', (0, express_validator_1.body)('username')
    .exists()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Characters not long enough, (min 2, max 255)'), (0, express_validator_1.body)('password')
    .exists()
    .withMessage('Password cannot be empty')
    .isLength({ min: 6 })
    .withMessage('Password is too weak'), 
/* .custom((value, {req})=>{
  if(value !== req.body.confirmPassword){
    return
  }
}), */
(0, express_validator_1.body)('email')
    .exists()
    .withMessage('Email field must not be empty'), request_handler_js_1.requestHandler.validate, user_controller_js_1.userController.userSignup);
router.post('/login', (0, express_validator_1.body)('email')
    .exists()
    .withMessage('Username field cannot be empty'), (0, express_validator_1.body)('password')
    .exists()
    .withMessage('Password field cannot be empty'), request_handler_js_1.requestHandler.validate, user_controller_js_1.userController.userLogin);
router.get('/get_user_token', token_middleware_js_1.tokenMiddleware.auth, user_controller_js_1.userController.getJwtTokenForUser);
exports.default = router;
