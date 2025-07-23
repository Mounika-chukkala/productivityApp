// routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const verifyUser=require("../middlewares/auth")
router.get('/notifications',verifyUser, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

router.post('/mark-read/:id',verifyUser, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error marking notification as read' });
  }
});
router.delete("deleteNotification/:id",verifyUser, async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
