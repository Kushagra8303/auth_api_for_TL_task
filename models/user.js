const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  // track the last login time and history for auditing/admin panel
  lastLogin: {
    type: Date,
  },

  loginHistory: [{
    type: Date,
  }],

},{timestamps:true});

module.exports = mongoose.model("User",userSchema);