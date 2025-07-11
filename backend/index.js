const express=require("express")
const cors=require("cors")
const dbConnect=require("./config/dbConnect")
const { PORT, FRONTEND_URL } = require("./config/dotenv.config")
const port=PORT || 5000
const app=express()
app.use(express.json());
// app.use(cors());
app.use(cors({origin:"*"}));
app.get("/",(req,res)=>{
    res.send("Hello ,welcome to Pen It")
})
app.listen(port,()=>{
    console.log("server started")
    dbConnect();
})