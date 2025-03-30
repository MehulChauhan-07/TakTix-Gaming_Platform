"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.auth = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const errorMiddleware_1 = require("./errorMiddleware");
// Function to verify a token and return user
const verifyToken = async (token) => {
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Get user from the token
        const user = await user_model_1.default.findById(decoded.id);
        return user;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
// Middleware to protect routes
const auth = async (req, res, next) => {
    try {
        // Get token from header or cookie
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new errorMiddleware_1.AppError('No authentication token, access denied', 401);
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        // Get user from token
        const user = await user_model_1.default.findById(decoded.id);
        if (!user) {
            throw new errorMiddleware_1.AppError('User not found', 404);
        }
        // Add user to request object
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errorMiddleware_1.AppError('Invalid token', 401));
        }
        else {
            next(error);
        }
    }
};
exports.auth = auth;
// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        next(new errorMiddleware_1.AppError("Not authorized as an admin", 403));
    }
};
exports.admin = admin;
