// // server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const http = require('http');
// const { Server } = require('socket.io');

// // Load environment variables
// dotenv.config();

// // Initialize Firebase Admin SDK
// const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json');
// if (!admin.apps.length) {
//   try {
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount),
//     });
//     console.log("✅ Firebase Admin SDK initialized");
//   } catch (err) {
//     console.error("❌ Firebase admin initialization error:", err);
//   }
// }

// // Import routes and middleware
// const verifyFirebaseToken = require('./middleware/verifyFirebaseToken');
// const authRoutes = require('./routes/authRoutes');
// const swipeRoutes = require('./routes/swipeRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');
// const accommodationsRoutes = require('./routes/accommodationRoutes');
// const restaurantsRoutes = require('./routes/restaurantRoutes');
// const Chat = require('./models/Chat');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "*",
//     methods: ["GET", "POST"],
//   },
// });

// // ===== Middleware =====
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// }));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ===== Routes =====
// app.use('/api/auth', authRoutes);
// app.use('/api/swipe', verifyFirebaseToken, swipeRoutes);
// app.use('/api/profile', verifyFirebaseToken, profileRoutes);
// app.use('/api/chat', verifyFirebaseToken, chatRoutes);
// app.use('/api/upload', verifyFirebaseToken, uploadRoutes);
// app.use('/api/accommodations', accommodationsRoutes);
// app.use('/api/restaurants', restaurantsRoutes);

// // ===== Socket.IO Setup =====
// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.auth?.token;
//     if (!token) throw new Error("No token provided");

//     const decodedToken = await admin.auth().verifyIdToken(token);
//     const userId = decodedToken.uid;
//     socket.userId = userId;
//     next();
//   } catch (err) {
//     console.error("Socket authentication error:", err.message);
//     next(new Error("Unauthorized"));
//   }
// });

// io.on('connection', (socket) => {
//   console.log(`🟢 User ${socket.userId} connected via socket ${socket.id}`);

//   socket.on('sendMessage', async ({ from, to, text }) => {
//     try {
//       const newMessage = await Chat.create({ sender: from, receiver: to, text });
//       io.to(to).emit('receiveMessage', newMessage);
//       console.log(`📨 Message from ${from} to ${to}: ${text}`);
//     } catch (err) {
//       console.error('❌ Error saving or sending message:', err);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log(`🔴 Socket disconnected: ${socket.id}`);
//   });
// });

// // ===== MongoDB Connection =====
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => {
//     console.error('❌ MongoDB Connection Error:', err);
//     process.exit(1);
//   });

// // ===== Start Server =====
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server & Socket.IO running on port ${PORT}`));




// // // server.js

// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const path = require('path');
// // const http = require('http');
// // const { Server } = require('socket.io');

// // // Load environment variables
// // dotenv.config();

// // // Initialize Firebase Admin SDK
// // const admin = require('firebase-admin');
// // const serviceAccount = require('./serviceAccountKey.json');
// // if (!admin.apps.length) {
// //   try {
// //     admin.initializeApp({
// //       credential: admin.credential.cert(serviceAccount),
// //     });
// //     console.log("✅ Firebase Admin SDK initialized");
// //   } catch (err) {
// //     console.error("❌ Firebase admin initialization error:", err);
// //   }
// // }

// // // Import routes and middleware
// // const verifyFirebaseToken = require('./middleware/verifyFirebaseToken');
// // const authRoutes = require('./routes/authRoutes');
// // const swipeRoutes = require('./routes/swipeRoutes');
// // const profileRoutes = require('./routes/profileRoutes');
// // const chatRoutes = require('./routes/chatRoutes');
// // const uploadRoutes = require('./routes/uploadRoutes');
// // const accommodationsRoutes = require('./routes/accommodationRoutes');
// // const restaurantsRoutes = require('./routes/restaurantRoutes');
// // const Chat = require('./models/Chat');

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: process.env.FRONTEND_URL || "*",
// //     methods: ["GET", "POST"],
// //   },
// // });

// // // ===== Middleware =====
// // app.use(cors({
// //   origin: process.env.FRONTEND_URL || "*",
// //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //   credentials: true,
// // }));
// // app.use(express.json());
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // ===== Routes =====
// // app.use('/api/auth', authRoutes);
// // app.use('/api/swipe', verifyFirebaseToken, swipeRoutes);
// // app.use('/api/profile', verifyFirebaseToken, profileRoutes);
// // app.use('/api/chat', verifyFirebaseToken, chatRoutes);
// // app.use('/api/upload', verifyFirebaseToken, uploadRoutes);
// // app.use('/api/accommodations', accommodationsRoutes);
// // app.use('/api/restaurants', restaurantsRoutes);

// // // ===== Socket.IO Setup =====
// // io.on('connection', async (socket) => {
// //   try {
// //     const token = socket.handshake.auth?.token;
// //     if (!token) throw new Error("No token provided");

// //     const decodedToken = await admin.auth().verifyIdToken(token);
// //     const userId = decodedToken.uid;

// //     socket.join(userId);
// //     console.log(`🟢 User ${userId} connected via socket ${socket.id}`);

// //     socket.on('sendMessage', async ({ from, to, text }) => {
// //       try {
// //         const newMessage = await Chat.create({ sender: from, receiver: to, text });
// //         io.to(to).emit('receiveMessage', newMessage);
// //         console.log(`📨 Message from ${from} to ${to}: ${text}`);
// //       } catch (err) {
// //         console.error('❌ Error saving or sending message:', err);
// //       }
// //     });

// //     socket.on('disconnect', () => {
// //       console.log(`🔴 Socket disconnected: ${socket.id}`);
// //     });

// //   } catch (err) {
// //     console.error("❌ Socket connection error:", err.message);
// //     socket.disconnect(true);
// //   }
// // });

// // mongoose.connect(process.env.MONGO_URI, {})
// //   .then(() => console.log('✅ MongoDB Connected'))
// //   .catch(err => {
// //     console.error('❌ MongoDB Connection Error:', err);
// //     process.exit(1);  // Exit if unable to connect to the database
// //   });

// // // ===== Start Server =====
// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => console.log(`🚀 Server & Socket.IO running on port ${PORT}`));
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

// ─── Public (Auth) Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── Protected Routes (require Firebase token) ────────────────────────────────
app.use('/api', verifyFirebaseToken);
app.use('/api/swipe', swipeRoutes);
app.use('/api/profile', profileRoutes);
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

// Define your Socket.IO event listeners here
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
