const express = require("express");
const router = express.Router();
const { markHabitDone } = require("../controllers/habitController");
const verifyUser = require("../middleware/auth");

router.post("/done/:id",verifyUser , markHabitDone);

module.exports = router;
