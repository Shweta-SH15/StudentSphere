const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.error('Firebase admin initialization error (possibly already initialized):', err);
}

// Import routes and middleware
const verifyFirebaseToken = require('./middleware/verifyFirebaseToken');
const authRoutes = require('./routes/authRoutes');
const swipeRoutes = require('./routes/swipeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const accommodationsRoutes = require('./routes/accommodationRoutes');
const restaurantsRoutes = require('./routes/restaurantRoutes');
const Chat = require('./models/Chat');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict to your frontend domain
    methods: ["GET", "POST"]
  }
});

// ===== Middleware =====
app.use(cors());
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Routes =====
// Public routes (no token required)
app.use('/api/auth', authRoutes);

// Protected routes (must pass Firebase ID token)
app.use('/api/swipe', verifyFirebaseToken, swipeRoutes);
app.use('/api/profile', verifyFirebaseToken, profileRoutes);
app.use('/api/chat', verifyFirebaseToken, chatRoutes);
app.use('/api/upload', verifyFirebaseToken, uploadRoutes);
// (If needed, protect accommodations/restaurants similarly if they require auth)
app.use('/api/accommodations', accommodationsRoutes);
app.use('/api/restaurants', restaurantsRoutes);

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ===== Socket.IO Setup (for chat feature) =====
io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.tokenUserId;
  if (userId) {
    socket.join(userId); // join the user's personal room for direct messages
    console.log(`🟢 User ${userId} connected via socket ${socket.id}`);
  } else {
    console.warn(`⚠️ No tokenUserId provided by socket ${socket.id}`);
  }

  // Handle incoming chat messages
  socket.on('sendMessage', async ({ from, to, text }) => {
    try {
      const newMessage = await Chat.create({ sender: from, receiver: to, text });
      io.to(to).emit('receiveMessage', newMessage);  // deliver message to receiver in real-time
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
