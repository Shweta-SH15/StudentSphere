const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const admin = require("./middleware/firebaseAdmin");
const Chat = require('./models/Message');

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
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 🔐 Socket.IO Middleware to Verify Firebase Token
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    console.warn("❌ No token provided");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    socket.userId = decoded.uid;
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return next(new Error("Authentication failed"));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  if (userId) {
    socket.join(userId);
    console.log(`🟢 User ${userId} connected via socket ${socket.id}`);
  }

  socket.on("sendMessage", async ({ from, to, text }) => {
    try {
      const newMessage = await Chat.create({
        sender: from,
        receiver: to,
        text,
      });

      io.to(to).emit("receiveMessage", newMessage);
      console.log(`📨 ${from} ➡️ ${to}: ${text}`);
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('✅ StudentSphere backend is live');
});

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/accommodations', require('./routes/accommodationRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
