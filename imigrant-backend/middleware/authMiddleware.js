// authmiddleware.js
// Use the admin instance exported by your initializer so it's always initialized.
const admin = require('./middleware/firebaseAdmin'); // <<-- important: point to your initialized module
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Load user by Firebase UID (your User._id is the Firebase UID)
    const user = await User.findById(uid).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Not authorized - user not found" });
    }

    // Attach to req — controllers expect req.user.uid
    req.user = { uid: user._id, ...user.toObject() };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Not authorized, token invalid" });
  }
};
