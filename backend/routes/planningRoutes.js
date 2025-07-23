const express = require("express");
const router = express.Router();
const {createPlan,getPlan,updatePlan}=require("../controllers/planningController")
const verifyUser = require("../middlewares/auth");

router.post("/create-plan", verifyUser, createPlan);
router.get("/get-plan", verifyUser, getPlan);
router.patch("/update-plan",verifyUser,updatePlan)
module.exports = router;
