// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notifications');
const verifyUser=require("../middlewares/auth")
router.get('notifications', verifyUser,async (req, res) => {
    const userId=req.user;
  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

module.exports = router;
