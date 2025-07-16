const express = require("express");
const router = express.Router();
const { getNotifications, markNotificationAsRead } = require("../controllers/notificationController");
const verifyUser = require("../middlewares/auth");

router.get("/", verifyUser, getNotifications);
router.patch("/:id/read", verifyUser, markNotificationAsRead);

module.exports = router;
