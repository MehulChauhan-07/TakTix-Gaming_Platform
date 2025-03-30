"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Get user by id
router.get("/:id", user_controller_1.getUserById);
// Update user
router.put("/", auth_1.auth, user_controller_1.updateUser);
// Delete user
router.delete("/", auth_1.auth, user_controller_1.deleteUser);
// Get user stats
router.get("/:id/stats", user_controller_1.getUserStats);
// Get user friends
router.get("/:id/friends", user_controller_1.getUserFriends);
// Add friend
router.post("/friends/:friendId", auth_1.auth, user_controller_1.addFriend);
// Remove friend
router.delete("/friends/:friendId", auth_1.auth, user_controller_1.removeFriend);
exports.default = router;
