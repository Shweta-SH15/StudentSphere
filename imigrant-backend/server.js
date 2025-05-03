const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const swipeRoutes = require('./routes/swipeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const Chat = require('./models/Chat');

const app = express();
const server = http.createServer(app); // ✅ Correct server setup for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend domain in production
    methods: ["GET", "POST"]
  }
});

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ✅ Serve uploaded images

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/accommodations', require('./routes/accommodationRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ===== Socket.IO Chat Setup =====
io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.tokenUserId;

  if (userId) {
    socket.join(userId); // Join personal room
    console.log(`🟢 User ${userId} connected via socket ${socket.id}`);
  } else {
    console.warn(`⚠️ No tokenUserId provided by socket ${socket.id}`);
  }

  // ✅ Handle incoming message
  socket.on('sendMessage', async ({ from, to, text }) => {
    try {
      const newMessage = await Chat.create({
        sender: from,
        receiver: to,
        text,
      });

      // ✅ Emit real-time message to receiver
      io.to(to).emit('receiveMessage', newMessage);

      console.log(`📨 Message from ${from} to ${to}: ${text}`);
    } catch (err) {
      console.error('❌ Error saving or sending message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server & Socket.IO running on port ${PORT}`));
