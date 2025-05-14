const admin = require('./firebaseAdmin');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // ✅ Validate token presence and format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("No valid authorization header provided");
      return res.status(401).json({ error: "Unauthorized: No valid token provided" });
    }

    // ✅ Extract the actual token
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error("No token found in authorization header");
      return res.status(401).json({ error: "Unauthorized: No token found" });
    }

    // ✅ Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "unknown@example.com",
      displayName: decodedToken.name || "Anonymous",
      picture: decodedToken.picture || "/uploads/default.png"
    };

    next();

  } catch (error) {
    console.error("Firebase token verification failed:", error.message);

    // Provide more specific error messages
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    } else if (error.code === "auth/argument-error") {
      return res.status(401).json({ error: "Unauthorized: Invalid token format" });
    } else if (error.code === "auth/invalid-id-token") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};
