// middleware/firebaseAdmin.js

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// Prevent duplicate app initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin Initialized");
}

module.exports = admin;
