"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const validator_1 = require("../middleware/validator");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
// Register user
router.post('/register', rateLimit_1.authLimiter, (0, validator_1.validate)([
    (0, express_validator_1.check)('username')
        .not()
        .isEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters'),
    (0, express_validator_1.check)('email')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.check)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
]), auth_controller_1.register);
// Login user
router.post('/login', rateLimit_1.authLimiter, (0, validator_1.validate)([
    (0, express_validator_1.check)('email')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.check)('password')
        .not()
        .isEmpty()
        .withMessage('Password is required'),
]), auth_controller_1.login);
// Logout user
router.post("/logout", auth_controller_1.logout);
// Get current user
router.get("/me", auth_1.auth, auth_controller_1.getCurrentUser);
exports.default = router;
