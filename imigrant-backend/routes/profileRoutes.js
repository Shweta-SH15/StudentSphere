// // // routes/profileRoutes.js

// // const express = require("express");
// // const router = express.Router();
// // const User = require("../models/User");
// // const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// // // ✅ Middleware to check for authenticated user
// // router.use(verifyFirebaseToken);

// // // ✅ Get the logged-in user's profile
// // router.get("/", async (req, res) => {
// //     try {
// //         const userId = req.user.uid;
// //         const user = await User.findById(userId).select("-password");  // Exclude password for security
// //         if (!user) return res.status(404).json({ error: "User not found" });
// //         res.json(user);
// //     } catch (err) {
// //         console.error("Profile fetch error:", err);
// //         res.status(500).json({ error: "Failed to fetch profile" });
// //     }
// // });

// // // ✅ Update the logged-in user's profile
// // router.put("/", async (req, res) => {
// //     try {
// //         const userId = req.user.uid;
// //         const updates = req.body;

// //         // Find and update the user in one step for better performance
// //         const user = await User.findByIdAndUpdate(userId, updates, {
// //             new: true,
// //             runValidators: true,
// //         }).select("-password");

// //         if (!user) return res.status(404).json({ error: "User not found" });

// //         res.json(user);
// //     } catch (err) {
// //         console.error("Profile update error:", err);
// //         res.status(500).json({ error: "Failed to update profile" });
// //     }
// // });

// // // ✅ Get liked friends, roommates, accommodations, and restaurants
// // const { getLikedFriends, getLikedRoommates, getLikedAccommodations, getLikedRestaurants, getFriendSuggestions, getRoommateSuggestions } = require("../controllers/profileController");

// // router.get("/friends", getLikedFriends);
// // router.get("/roommates", getLikedRoommates);
// // router.get("/accommodations", getLikedAccommodations);
// // router.get("/restaurants", getLikedRestaurants);
// // router.get("/friend-suggestions", getFriendSuggestions);
// // router.get("/roommate-suggestions", getRoommateSuggestions);

// // module.exports = router;

// // routes/profileRoutes.js

// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// // All profile routes require a valid Firebase token
// router.use(verifyFirebaseToken);

// // GET  /api/profile
// // Fetch the current user's profile (404 only if something goes wrong server-side)
// router.get("/", async (req, res) => {
//   try {
//     const uid = req.user.uid;
//     const user = await User.findById(uid).select("-password");
//     // We won't auto-create on GET, but you could if you prefer.
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json(user);
//   } catch (err) {
//     console.error("Profile fetch error:", err);
//     res.status(500).json({ error: "Failed to fetch profile" });
//   }
// });

// // PUT  /api/profile
// // Update (or create!) the current user's profile
// router.put("/", async (req, res) => {
//   try {
//     const uid = req.user.uid;
//     const updates = req.body;

//     // findOneAndUpdate with upsert to create if missing
//     const user = await User.findOneAndUpdate(
//       { _id: uid },
//       {
//         // apply all incoming fields
//         $set: updates,
//         // but if inserting for the first time, set these fields:
//         $setOnInsert: {
//           email: req.user.email,
//           // you could set defaults for other required fields here
//         }
//       },
//       {
//         new: true,            // return the updated (or newly created) doc
//         upsert: true,         // create if not exists
//         runValidators: true,  // enforce your schema validators
//         context: "query"
//       }
//     ).select("-password");

//     res.json(user);
//   } catch (err) {
//     console.error("Profile update error:", err);
//     res.status(500).json({ error: "Failed to update profile" });
//   }
// });

// // (The rest of your “liked” endpoints stay the same)
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

// routes/profileRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// All profile routes require a valid Firebase token
router.use(verifyFirebaseToken);

// ✅ Get the logged-in user's profile
router.get("/", async (req, res) => {
  try {
    const uid = req.user.uid;
    const user = await User.findById(uid).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ✅ Update (or create!) the current user's profile
router.put("/", async (req, res) => {
  try {
    const uid = req.user.uid;
    const updates = req.body;

    // findOneAndUpdate with upsert to create if missing
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
    const errorMessage = err.code === 11000 ? "Email already in use" : "Failed to update profile";
    res.status(500).json({ error: errorMessage });
  }
});

// ✅ Liked friends, roommates, accommodations, and restaurants
const {
  getLikedFriends,
  getLikedRoommates,
  getLikedAccommodations,
  getLikedRestaurants,
  getFriendSuggestions,
  getRoommateSuggestions
} = require("../controllers/profileController");

router.get("/friends", getLikedFriends);
router.get("/roommates", getLikedRoommates);
router.get("/accommodations", getLikedAccommodations);
router.get("/restaurants", getLikedRestaurants);
router.get("/friend-suggestions", getFriendSuggestions);
router.get("/roommate-suggestions", getRoommateSuggestions);

module.exports = router;
