// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const admin = require('./middleware/firebaseAdmin');
const Message = require('./models/Message'); // standardized name

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const swipeRoutes = require('./routes/swipeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// ===== CORS =====
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);

// ===== SOCKET.IO =====
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// 🔐 Firebase Token Verification for Socket.io
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    console.warn("❌ No token provided in socket handshake");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    socket.userId = decoded.uid;
    return next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return next(new Error("Authentication failed"));
  }
});

// ===== SOCKET CONNECTION =====
io.on('connection', (socket) => {
  const userId = socket.userId;
  console.log(`[Socket] connected ${socket.id}, userId=${userId}`);

  if (userId) {
    socket.join(userId);
    console.log(`[Socket] user ${userId} joined room ${userId}`);
  }

  // ===== SEND MESSAGE =====
  socket.on('sendMessage', async ({ from, to, text }) => {
  try {
    const senderId = from || socket.userId;
    const receiverId = to;

    if (!senderId || !receiverId || !text?.trim()) {
      return socket.emit('message-error', { error: 'Invalid message payload' });
    }

    // ✅ Save normalized message
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
    });

    const payload = {
      _id: newMessage._id,
      sender: senderId,
      receiver: receiverId,
      text: newMessage.text,
      timestamp: newMessage.createdAt,
    };

    // Emit to both
    io.to(receiverId).emit("receiveMessage", payload);
    io.to(senderId).emit("messageDelivered", payload);

    console.log(`📨 Message from ${senderId} → ${receiverId}: ${text}`);
  } catch (err) {
    console.error("❌ Error in sendMessage:", err);
    socket.emit("message-error", { error: "Failed to send message" });
  }
});


  socket.on('disconnect', (reason) => {
    console.log(`[Socket] disconnected ${socket.id}, reason=${reason}`);
  });
});

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/accommodations', require('./routes/accommodationRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
