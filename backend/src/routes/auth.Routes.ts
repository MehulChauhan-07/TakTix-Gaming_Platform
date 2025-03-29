import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = Router();

// Register a new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get current user
router.get("/me", auth, getCurrentUser);

export default router;
