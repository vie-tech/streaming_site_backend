const mongoose = require('mongoose')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 255,
        trim: true,
        lowercase: true,
        unique: true,
      },
      email:{
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 255,
      },

      age: {
        type: Number,
        required: true,
        min: 18,
        max: 120,
      },

      permissionToLiveStream:{
        type: Boolean,
        default: true
      },

      hostId: {
        type: String,
        required: true
      }

})


userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString("hex")
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha512").toString("hex")
  }
  
  userSchema.methods.validPassword = function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha512").toString("hex");
    return this.password === hash;
  }


  const User = mongoose.model("User", userSchema)


  module.exports = {User}