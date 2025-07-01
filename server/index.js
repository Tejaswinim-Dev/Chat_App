const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.routes');
const messageRoute = require('./routes/messages.route');
const otpRoute = require('./routes/otp.route');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', userRoute);
app.use('/api/messages', messageRoute);
app.use('/api/otp', otpRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("✅ DB connected successfully");
}).catch((err) => {
  console.log("❌ DB connection failed:", err.message);
});

// HTTP + Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Online users map
const onlineUsers = new Map();

// Message model
const Message = require('./model/messages.model');

// Socket.IO handlers
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Track online user
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Send message handler
  socket.on("send-msg", async (data) => {
    const { from, to, message } = data;

    try {
      // Save to DB
      await Message.create({
        message,
        users: [from, to],
        sender: from,
      });

      // Get receiver socket ID
      const receiverSocket = onlineUsers.get(to);

      // Emit to receiver if online
      if (receiverSocket) {
        socket.to(receiverSocket).emit("msg-receive", {
          from,
          message,
        });
      }
    } catch (err) {
      console.error("❌ Error saving or sending message:", err.message);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});




