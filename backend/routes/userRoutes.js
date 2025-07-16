const express=require("express")
const router=express.Router();
const User=require("../models/userSchema")

const {createUser,login,verifyEmail,googleAuth}=require("../controllers/userController");
// const verifyUser=require("../middlewares/auth")

router.post("/signup", createUser);
router.post("/signin", login);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/google-auth", googleAuth);
 
module.exports=router