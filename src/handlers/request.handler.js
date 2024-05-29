const validationResult = require('express-validator').validationResult


const validate = (req, res, next)=>{
 const errors = validationResult(req)
 if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()[0].msg})
 }else{
   next()
 }
}

module.exports = {validate}