import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  getUserFriends,
  addFriend,
  removeFriend,
} from "../controllers/user.controller";

const router = Router();

// Get user by id
router.get("/:id", getUserById);

// Update user
router.put("/", auth, updateUser);

// Delete user
router.delete("/", auth, deleteUser);

// Get user stats
router.get("/:id/stats", getUserStats);

// Get user friends
router.get("/:id/friends", getUserFriends);

// Add friend
router.post("/friends/:friendId", auth, addFriend);

// Remove friend
router.delete("/friends/:friendId", auth, removeFriend);

export default router;