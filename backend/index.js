const express=require("express")
const cors=require("cors")
const dbConnect=require("./config/dbConnect")
const { PORT, FRONTEND_URL } = require("./config/dotenv.config")
const port=PORT || 5000
const taskRoutes=require("./routes/taskRoutes");
const userRoutes=require("./routes/userRoutes");
const scheduleMissedHabitCheck = require("./cron/missedHabitCheck");
const scheduleMorningCheck=require("./cron/morningReminder")
const habitRoutes=require("./routes/habitRoutes");
const cron = require("node-cron");
const notificationRouter=require("./routes/notifications");
const notesRouter=require("./routes/noteRoutes");
const analyticsRouter=require("./routes/analyticsRoutes")
const planningRouter=require("./routes/planningRoutes")
const app=express()
app.use(express.json());
app.use(cors({origin:"*"}));
app.get("/",(req,res)=>{
    res.send("Hello ,welcome to Pen It")
})


app.use("/api/v1",userRoutes);
app.use("/api/v1",notificationRouter);

app.use("/api/v1",taskRoutes);
app.use("/api/v1",habitRoutes)
app.use("/api/v1",planningRouter)
app.use("/api/v1",notesRouter)

app.use("/api/v1/analytics",analyticsRouter)
// app.use("/api/v1",eventRoutes)
app.listen(port,()=>{
    console.log("server started")
    dbConnect();
    console.log("Database connected successfully")
    scheduleMissedHabitCheck()
    scheduleMorningCheck()
})