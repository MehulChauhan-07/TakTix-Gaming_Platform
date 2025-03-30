"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameLimiter = exports.authLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Rate limiting for all requests
exports.globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
// Rate limiting for authentication requests
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 failed attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Only count failed attempts
    message: 'Too many login attempts from this IP, please try again after an hour',
});
// Rate limiting for game moves
exports.gameLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 game moves per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many game moves, please slow down',
});
