// in server/middleware/firebaseAuth.js
const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.cert(require("../firebaseServiceAccountKey.json")) });

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};
module.exports = verifyFirebaseToken;
