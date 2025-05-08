// // middleware/verifyFirebaseToken.js

// const admin = require("firebase-admin");

// module.exports = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;
        
//         // Check if the header is present and properly formatted
//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             console.error("No valid authorization header provided");
//             return res.status(401).json({ error: "Unauthorized: No valid token provided" });
//         }

//         // Extract the token
//         const token = authHeader.split(" ")[1];
//         if (!token) {
//             console.error("No token found in authorization header");
//             return res.status(401).json({ error: "Unauthorized: No token found" });
//         }

//         // Verify the Firebase ID token
//         const decodedToken = await admin.auth().verifyIdToken(token);
//         req.user = {
//             uid: decodedToken.uid,
//             email: decodedToken.email,
//             role: decodedToken.role || "user",  // Default role if not set
//             displayName: decodedToken.name || "Anonymous",
//             picture: decodedToken.picture || "/uploads/default.png"
//         };

//         next();

//     } catch (error) {
//         console.error("Token verification failed:", error);

//         // Provide more specific error messages based on the error type
//         if (error.code === "auth/id-token-expired") {
//             return res.status(401).json({ error: "Unauthorized: Token expired" });
//         } else if (error.code === "auth/argument-error") {
//             return res.status(401).json({ error: "Unauthorized: Invalid token format" });
//         } else if (error.code === "auth/invalid-id-token") {
//             return res.status(401).json({ error: "Unauthorized: Invalid token" });
//         } else {
//             return res.status(500).json({ error: "Internal server error" });
//         }
//     }
// };

// middleware/verifyFirebaseToken.js

// const admin = require("firebase-admin");

// module.exports = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "Unauthorized: No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     req.user = { uid: decodedToken.uid, email: decodedToken.email };
//     next();
//   } catch (error) {
//     console.error("Firebase token verification failed:", error.message);
//     res.status(401).json({ error: "Unauthorized: Invalid token" });
//   }
// };

const admin = require('./firebaseAdmin');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid, email: decodedToken.email };
    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
