import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
import { check } from 'express-validator';
import { validate } from '../middleware/validator';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

// Register user
router.post(
  '/register',
  authLimiter,
  validate([
    check('username')
      .not()
      .isEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),
    check('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ]),
  register
);

// Login user
router.post(
  '/login',
  authLimiter,
  validate([
    check('email')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Password is required'),
  ]),
  login
);

// Logout user
router.post("/logout", logout);

// Get current user
router.get("/me", auth, getCurrentUser);

export default router;
