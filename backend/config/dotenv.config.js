require("dotenv").config();
module.exports={
      DB_URL: process.env.MONGODB_URL,
      PORT: process.env.PORT,
      FRONTEND_URL: process.env.FRONTEND_URL
}