// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');
// require('dotenv').config();

// const admin = require('./middleware/firebaseAdmin');
// const verifyFirebaseToken = require('./middleware/verifyFirebaseToken');

// const authRoutes = require('./routes/authRoutes');
// const swipeRoutes = require('./routes/swipeRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const accommodationsRoutes = require('./routes/accommodationRoutes');
// const restaurantsRoutes = require('./routes/restaurantRoutes');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "*",
//     methods: ["GET", "POST"],
//   },
// });

// // ─── Connect to MongoDB ───────────────────────────────────────────────────────
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => {
//     console.error('❌ MongoDB Connection Error:', err);
//     process.exit(1);
//   });

// // ─── Global Middleware ────────────────────────────────────────────────────────
// app.use(cors());
// app.use(express.json());

// // ─── Serve uploaded files ─────────────────────────────────────────────────────
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"))
// );

// // ─── Public (Auth) Routes ─────────────────────────────────────────────────────
// app.use('/api/auth', authRoutes);

// // ─── Protected Routes (require Firebase token) ────────────────────────────────
// app.use('/api', verifyFirebaseToken);
// app.use('/api/swipe', swipeRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/accommodations', accommodationsRoutes);
// app.use('/api/restaurants', restaurantsRoutes);

// // ─── Serve Frontend in Production ─────────────────────────────────────────────
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../dist')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.join(__dirname, '../dist/index.html'))
//   );
// }

// // ─── Socket.IO Authentication ─────────────────────────────────────────────────
// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.auth?.token;
//     if (!token) throw new Error("No token provided");

//     const decodedToken = await admin.auth().verifyIdToken(token);
//     socket.userId = decodedToken.uid;
//     next();
//   } catch (err) {
//     console.error("Socket authentication error:", err.message);
//     next(new Error("Unauthorized"));
//   }
// });

// // Socket.IO event listeners
// io.on('connection', (socket) => {
//   console.log('🔌 User connected:', socket.userId);

//   socket.on('disconnect', () => {
//     console.log('❌ User disconnected');
//   });
// });

// // ─── Start Server ─────────────────────────────────────────────────────────────
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`🚀 Server & Socket.IO running on port ${PORT}`)
// );

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const admin = require('./middleware/firebaseAdmin');
const verifyFirebaseToken = require('./middleware/verifyFirebaseToken');

const authRoutes = require('./routes/authRoutes');
const swipeRoutes = require('./routes/swipeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const accommodationsRoutes = require('./routes/accommodationRoutes');
const restaurantsRoutes = require('./routes/restaurantRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Serve uploaded files ─────────────────────────────────────────────────────
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ─── Public (Auth) Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Protected Routes (require Firebase token) ────────────────────────────────
app.use('/api', verifyFirebaseToken);
app.use('/api/swipe', swipeRoutes);
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/accommodations', accommodationsRoutes);
app.use('/api/restaurants', restaurantsRoutes);

// ─── Serve Frontend in Production ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  );
}

// ─── Socket.IO Authentication ─────────────────────────────────────────────────
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) throw new Error("No token provided");

    const decodedToken = await admin.auth().verifyIdToken(token);
    socket.userId = decodedToken.uid;
    next();
  } catch (err) {
    console.error("Socket authentication error:", err.message);
    next(new Error("Unauthorized"));
  }
});

// Socket.IO event listeners
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.userId);

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server & Socket.IO running on port ${PORT}`)
);
