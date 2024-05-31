const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
      },
     
})


userSchema.methods.setPassword = async function(password){
    this.password = await bcrypt.hash(password, 10)
    return this.password
  }
  
  userSchema.methods.validPassword = async function(password) {
    const passwordMatch = await bcrypt.compare(password, this.password);
    if(!passwordMatch){
      return false
    }else{
      return true
    }
  };


  const User = mongoose.model("User", userSchema)


  module.exports = {User}