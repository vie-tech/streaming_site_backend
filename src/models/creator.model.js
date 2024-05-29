const mongoose = require("mongoose");
const crypto = require("crypto");

const creatorSchema = new mongoose.Schema({
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
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  subscriberCount: {
    type: Number,
    default: 0
  },

  role: {
   type: String,
   default: "creator"
  },

  gender:{
    type: Number,
    required: true,
    default: null
  }
});

creatorSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString("hex")
  this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha512").toString("hex")
}

creatorSchema.methods.validPassword = function(password){
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, "sha512").toString("hex");
  return this.password === hash;
}


const Creator = mongoose.model("Creator", creatorSchema);

module.exports = { Creator };
