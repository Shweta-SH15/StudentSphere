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

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can replace * with your frontend URL (e.g. http://localhost:3000)
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ✅ Static file serving for images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Socket.IO Setup
io.on('connection', (socket) => {
  console.log('🟢 New Socket connected:', socket.id);

  // Get userId from frontend via socket.auth
  const userId = socket.handshake.auth?.tokenUserId;
  if (userId) {
    socket.join(userId); // Join personal room
    console.log(`👤 User ${userId} joined room`);
  }

  // When user sends message
  socket.on('sendMessage', ({ to, message }) => {
    const msg = {
      from: userId,
      to,
      message,
      timestamp: new Date()
    };

    // Emit to receiver's personal room
    io.to(to).emit('receiveMessage', msg);

    console.log(`📩 Message from ${userId} to ${to}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server & Socket.IO running on port ${PORT}`));
