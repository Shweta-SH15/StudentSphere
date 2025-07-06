
// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// // All profile routes require a valid Firebase token
// router.use(verifyFirebaseToken);

// // ✅ Get the logged-in user's profile
// router.get("/", async (req, res) => {
//   try {
//     const uid = req.user.uid;
//     let user = await User.findById(uid).select("-password");

//     // Auto-create user if not found
//     if (!user) {
//       user = await User.create({
//         _id: uid,
//         email: req.user.email,
//         name: req.user.displayName || "New User",
//         profileImage: req.user.picture || "/uploads/default.png"
//       });
//     }

//     res.json(user);
//   } catch (err) {
//     console.error("Profile fetch error:", err);
//     res.status(500).json({ error: "Failed to fetch or create profile" });
//   }
// });

// // ✅ Update (or create!) the current user's profile
// router.put("/", async (req, res) => {
//   try {
//     const uid = req.user.uid;
//     const updates = req.body;

//     // findOneAndUpdate with upsert to create if missing
//     const user = await User.findOneAndUpdate(
//       { _id: uid },
//       {
//         $set: updates,
//         $setOnInsert: {
//           _id: uid,
//           email: req.user.email || "unknown@example.com",
//         }
//       },
//       {
//         new: true,
//         upsert: true,
//         runValidators: true,
//         context: "query"
//       }
//     ).select("-password");

//     res.json(user);
//   } catch (err) {
//     console.error("Profile update error:", err);
//     const errorMessage = err.code === 11000 ? "Email already in use" : "Failed to update profile";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// // ✅ Liked friends, roommates, accommodations, and restaurants
// const {
//   getLikedFriends,
//   getLikedRoommates,
//   getLikedAccommodations,
//   getLikedRestaurants,
//   getFriendSuggestions,
//   getRoommateSuggestions
// } = require("../controllers/profileController");

// router.get("/friends", getLikedFriends);
// router.get("/roommates", getLikedRoommates);
// router.get("/accommodations", getLikedAccommodations);
// router.get("/restaurants", getLikedRestaurants);
// router.get("/friend-suggestions", getFriendSuggestions);
// router.get("/roommate-suggestions", getRoommateSuggestions);

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const {
  getLikedFriends,
  getLikedRoommates,
  getLikedAccommodations,
  getLikedRestaurants,
  getFriendSuggestions,
  getRoommateSuggestions,
  updateAvatar
} = require("../controllers/profileController");

router.use(verifyFirebaseToken);

// ✅ Get or auto-create profile
router.get("/", async (req, res) => {
  try {
    const uid = req.user.uid;
    let user = await User.findById(uid).select("-password");
    if (!user) {
      user = await User.create({
        _id: uid,
        email: req.user.email,
        name: req.user.displayName || "New User",
        avatarConfig: "topType=ShortHairShortCurly&clotheType=Hoodie" // ✅ default avatar
      });
    }
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch or create profile" });
  }
});

// ✅ Update profile info
router.put("/", async (req, res) => {
  try {
    const uid = req.user.uid;
    const updates = req.body;

    const user = await User.findOneAndUpdate(
      { _id: uid },
      {
        $set: updates,
        $setOnInsert: {
          _id: uid,
          email: req.user.email || "unknown@example.com",
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        context: "query"
      }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ✅ Avatar-only route
router.put("/avatar", updateAvatar);

// ✅ Liked + Suggestions
router.get("/friends", getLikedFriends);
router.get("/roommates", getLikedRoommates);
router.get("/accommodations", getLikedAccommodations);
router.get("/restaurants", getLikedRestaurants);
router.get("/friend-suggestions", getFriendSuggestions);
router.get("/roommate-suggestions", getRoommateSuggestions);

module.exports = router;
