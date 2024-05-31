const {body} = require('express-validator')
const userController = require('../controllers/user.controller.js')
const express = require('express')
const tokenMiddleware = require('../middleware/token.middleware.js')
const router = express.Router()
const requestHandler = require('../handlers/request.handler.js')




router.post(
    '/signup',
    body('username')
    .exists()
    .withMessage('Username is required')
    .isLength({min: 3})
    .withMessage('Characters not long enough, (min 2, max 255)'),

    body('password')
    .exists()
    .withMessage('Password cannot be empty')
    .isLength({min: 6})
    .withMessage('Password is too weak'),
    /* .custom((value, {req})=>{
      if(value !== req.body.confirmPassword){
        return 
      }
    }), */

    body('email')
    .exists()
    .withMessage('Email field must not be empty'),
    requestHandler.validate,
    userController.userSignup
)


router.post(
    '/login',
    body('email')
    .exists()
    .withMessage('Username field cannot be empty'),
    body('password')
    .exists()
    .withMessage('Password field cannot be empty'),
    requestHandler.validate,
    userController.userLogin
)


module.exports = {router}