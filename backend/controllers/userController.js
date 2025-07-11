const User=require("../models/userSchema")
const bcrypt=require("bcrypt");
const {generateJWT,verifyJWT}=require("../utils/generateToken")
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 7 });
const transporter  = require("../utils/transporter");
const {EMAIL_HOST,EMAIL_PASS,EMAIL_PORT,EMAIL_USER} =require("../config/dotenv.config")
const admin=require("firebase-admin")
const {getAuth}=require("firebase-admin/auth")
admin.initializeApp({
  credential: admin.credential.cert({
  "type": FIREBASE_ADMIN_TYPE,
  "project_id": FIREBASE_PROJECT_ID,
  "private_key_id": FIREBASE_PRIVATE_KEY_ID,
  "private_key": FIREBASE_PRIVATE_KEY,
  "client_email":FIREBASE_CLIENT_EMAIL,
  "client_id": FIREBASE_CLIENT_ID,
  "auth_uri":   FIREBASE_AUTH_URI,
  "token_uri": FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url":FIREBASE_AUTH_PROVIDER,
  "client_x509_cert_url": FIREBASE_CLIENT_CERT_URL,
  "universe_domain":FIREBASE_UNIVERSE_DOMAIN
}
)

})

async function createUser(req, res) {
  const { name, password, email } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please enter the name",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the password",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter the email",
      });
    }

    const checkForexistingUser = await User.findOne({ email });
if(checkForexistingUser){
   if(checkForexistingUser.googleAuth){
      return res.status(400).json({
          success: true,
          message:
            "This email already registered with google. please try to login with google",
        });
    } 
  if(checkForexistingUser.isVerify){
    return res.status(400).json({success:false,message:"User already exists"})
  }else{
     let verificationToken = await generateJWT({
      email: checkForexistingUser.email,
      id: checkForexistingUser._id,
    });
 

const sendingEmail=await transporter.sendMail({
  from:EMAIL_USER,
  to:email,
  subject:"Email verification",
  text:"Please verify yout email",
  html:`<p>Hey ${name}</p>
  <h1> Click on the link to verify your email</h1>
  <a href="${FRONTEND_URL}/verify-email/${verificationToken}">verify Email</a>`
})

  return res.status(200).json({
      success: true,
      message: "Please Check Your Email to verify your account",
      user:user
    });
}

}

    const hashedPass = await bcrypt.hash(password, 10);
   const username = email.split("@")[0] + randomUUID();

    const newUser = await User.create({
      name,
      email,
      password: hashedPass,
      username,
    });

    let verificationToken = await generateJWT({
      email: newUser.email,
      id: newUser._id,
    });
 

const sendingEmail=await transporter.sendMail({
  from:EMAIL_USER,
  to:email,
  subject:"Email verification",
  text:"Please verify yout email",
  html:`<p>Hey ${name}</p>
  <h1> Click on the link to verify your email</h1>
  <a href="${FRONTEND_URL}/verify-email/${verificationToken}">verify Email</a>`
})

const user={email:newUser.email,name:newUser.name,id:newUser._id,token:verificationToken};
    return res.status(200).json({
      success: true,
      message: "Please Check Your Email to verify your account",
      user:user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}

async function verifyEmail(req, res) {
  try {
    const { verificationToken } = req.params;

    const verifyToken = await verifyJWT(verificationToken);

    if (!verifyToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token/Email expired",
      });
    }
    const { id } = verifyToken;
    const user = await User.findByIdAndUpdate(
      id,
      { isVerify: true },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: error.message,
    });
  }
}
async function googleAuth(req, res) {
  try {
    const { accessToken } = req.body;

    const response = await getAuth().verifyIdToken(accessToken);

    const { name, email } = response;

    let user = await User.findOne({ email });

    if (user) {
      if (user.googleAuth) {
        let token = await generateJWT({
          email: user.email,
          id: user._id,
        });

        return res.status(200).json({
          success: true,
          message: "logged in successfully",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            username: user.username,
                    googleAuth:user.googleAuth,
        habits:user.habits,
            token,
          },
        });
      } else {
        return res.status(400).json({
          success: true,
          message:
            "This email already registered without google. please try through login form",
        });
      }
    }
    const username = email.split("@")[0] +randomUUID();

    let newUser = await User.create({
      name,
      email,
      googleAuth: true,
      isVerify: true,
      username,
    });

    let token = await generateJWT({
      email: newUser.email,
      id: newUser._id,
    });

    return res.status(200).json({
      success: true,
      message: "Registration  successfull",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
        username: newUser.username,
                googleAuth:newUser.googleAuth,
        habits:newUser.habits,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: error.message,
    });
  }
}

async function login(req, res) {
  const { password, email } = req.body;

  try {
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter the password",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter the email",
      });
    }

    const checkForexistingUser = await User.findOne({ email })
    .select(
      "password isVerify name email interests profilePic username bio showLikedBlogs showSavedBlogs followers following googleAuth"
    )

    if (!checkForexistingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }
    if(checkForexistingUser.googleAuth){
      return res.status(400).json({
          success: true,
          message:
            "This email already registered with google. please try to login with google",
        });
    } 
    let checkForPass = await bcrypt.compare(
      password,
      checkForexistingUser.password
    );

    if (!checkForPass) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    if (!checkForexistingUser.isVerify) {

       let verificationToken = await generateJWT({
      email: checkForexistingUser.email,
      id: checkForexistingUser._id,
    });

const sendingEmail=await transporter.sendMail({
  from:EMAIL_USER,
  to:checkForexistingUser.email,
  subject:"Email verification",
  text:"Please verify yout email",
  html:`<p>Hey ${checkForexistingUser.name}</p>
  <h1> Click on the link to verify your email</h1>
  <a href="${FRONTEND_URL}/verify-email/${verificationToken}">verify Email</a>`
})
      return res.status(400).json({
        success: false,
        message: "Please verify your email buddy",
      });
    }


    

    let token = await generateJWT({
      email: checkForexistingUser.email,
      id: checkForexistingUser._id,
    });


    return res.status(200).json({
      success: true,
      message: "logged in successfully",
      user: {
        id: checkForexistingUser._id,
        name: checkForexistingUser.name,
        email: checkForexistingUser.email,
        profilePic: checkForexistingUser.profilePic,
        username: checkForexistingUser.username,
        googleAuth:checkForexistingUser.googleAuth,
        habits:checkForexistingUser.habits,
        token,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Please try again",
      error: err.message,
    });
  }
}


async function Addhabits(req,res){

}

module.exports={
    createUser,googleAuth,login,verifyEmail
}

