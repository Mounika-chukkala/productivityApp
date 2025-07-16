const express = require("express");
const router = express.Router();
const { markHabitDone,getHabits,addHabit,deleteHabit } = require("../controllers/habitController");
const verifyUser = require("../middlewares/auth");

router.put("/done/:id",verifyUser , markHabitDone);
router.get("/get-habits",verifyUser,getHabits);
router.post("/create-habit",verifyUser,addHabit);
router.delete("/delete-habit/:id",verifyUser,deleteHabit);

module.exports = router;
