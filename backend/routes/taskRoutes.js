const express=require("express")
const router=express.Router();
const Task=require("../models/taskSchema")
const verifyUser=require("../middlewares/auth")
const {taskCreation,getTasks,updateTask,deleteTask}=require("../controllers/taskController")

router.post("/create-task",verifyUser,taskCreation);
router.get("/user/:userId",verifyUser,getTasks);
router.put("/update/:id",verifyUser,updateTask);
router.delete("/delete/:id",verifyUser,deleteTask)
module.exports=router