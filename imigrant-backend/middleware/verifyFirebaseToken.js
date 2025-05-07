// middleware/verifyFirebaseToken.js

const admin = require("firebase-admin");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("No token provided");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid }; // Use Firebase UID as the user ID
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
