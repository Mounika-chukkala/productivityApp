const express = require("express");
const router = express.Router();
const { markHabitDone,getHabits,addHabit } = require("../controllers/habitController");
const verifyUser = require("../middlewares/auth");

router.post("/done/:id",verifyUser , markHabitDone);
router.get("/get-habits",verifyUser,getHabits);
router.post("/create-habit",verifyUser,addHabit);
module.exports = router;
