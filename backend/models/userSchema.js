const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username:{
type: String,
      required: true,
      unique: true,
  },
  password: {
    type: String,
    required: true,
  },
   isVerify: {
      type: Boolean,
      default: false,
    },
  profilePic: {
    type: String,
    default: "",
  },
  googleAuth: {
      type: Boolean,
      default: false,
    },
    profilePicId: {
      type: String,
      default: null,
    },
    habits:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Habit"
    }],
  streak: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Streak",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
