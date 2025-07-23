const express = require("express");
const router = express.Router();
const { getProgressData, getPriorityDistribution, getStreakData, getTimeAllocation, getOverdueVsCompleted } = require("../controllers/analyticsControllers");
const verifyUser=require("../middlewares/auth")

router.get("/progress", verifyUser, getProgressData);
router.get("/distribution", verifyUser, getPriorityDistribution);
router.get("/streak", verifyUser, getStreakData);
router.get("/time-allocation", verifyUser, getTimeAllocation);
router.get("/overdue-vs-completed", verifyUser, getOverdueVsCompleted);


module.exports = router;
