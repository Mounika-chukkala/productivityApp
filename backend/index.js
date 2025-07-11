const express=require("express")
const cors=require("cors")
const dbConnect=require("./config/dbConnect")
const { PORT, FRONTEND_URL } = require("./config/dotenv.config")
const port=PORT || 5000
const taskRoutes=require("./routes/taskRoutes");
const userRoutes=require("./routes/userRoutes");
const habitRoutes=require("./routes/habitRoutes");
const cron = require("node-cron");
const checkAndHandleRecurringTasks=require("./utils/checkAndHandleRecurringTasks")


const app=express()
app.use(express.json());
app.use(cors({origin:"*"}));
app.get("/",(req,res)=>{
    res.send("Hello ,welcome to Pen It")
})

cron.schedule("0 0 * * *", () => {
  console.log("Running recurring task check...");
  checkAndHandleRecurringTasks();
});

app.use("/api/v1",userRoutes);
app.use("/api/v1",taskRoutes);
// app.use("/api/v1",streakRoutes);
app.use("/api/v1",habitRoutes)
app.listen(port,()=>{
    console.log("server started")
    dbConnect();
})