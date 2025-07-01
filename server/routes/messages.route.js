const router = require("express").Router();
const Message = require("../model/messages.model");

// Save message
router.post("/addmsg", async (req, res) => {
  try {
    const { from, to, message } = req.body;

    const msg = await Message.create({
      message: message,
      users: [from, to],
      sender: from,
    });

    return res.json({ status: true, msg: "Message sent successfully" });
  } catch (ex) {
    return res.status(500).json({ msg: ex.message });
  }
});

// Get all messages between two users
router.post("/getmsg", async (req, res) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message,
      time: new Date(msg.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return res.json(projectedMessages);
  } catch (ex) {
    return res.status(500).json({ msg: ex.message });
  }
});
router.delete("/deletemessages", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: "Missing 'from' or 'to' parameters." });
    }

    await Message.deleteMany({
      $or: [
        { from, to },
        { from: to, to: from },
      ],
    });

    return res.status(200).json({ success: true, message: "Messages deleted successfully." });
  } catch (err) {
    console.error("Error deleting messages:", err);
    return res.status(500).json({ error: "Failed to delete messages" });
  }
});
// Save voice message
router.post("/voice", async (req, res) => {
  try {
    const { from, to, audio } = req.body;

    if (!audio || !from || !to) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    await Message.create({
      message: "", // No text
      audio,
      users: [from, to],
      sender: from,
    });

    return res.status(201).json({ status: true, msg: "Voice message sent successfully" });
  } catch (err) {
    console.error("Error saving voice message:", err);
    return res.status(500).json({ msg: "Failed to send voice message" });
  }
});






module.exports = router;
