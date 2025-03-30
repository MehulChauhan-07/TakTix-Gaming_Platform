"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Helper function to generate JWT token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    });
};
// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = generateToken(user._id.toString());
    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    res
        .status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
        status: "success",
        token,
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                stats: user.stats,
                rating: user.rating,
            },
        },
    });
};
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            res.status(400).json({
                status: 'error',
                message: 'User with this email or username already exists',
            });
            return;
        }
        // Create new user
        const user = new user_model_1.default({
            username,
            email,
            password,
        });
        await user.save();
        // Generate JWT token
        const token = user.generateAuthToken();
        // Remove password from response
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        };
        // Send success response
        res.status(201).json({
            status: 'success',
            token,
            user: userResponse,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating user',
        });
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await user_model_1.default.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
            return;
        }
        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                status: 'error',
                message: 'Invalid email or password',
            });
            return;
        }
        // Generate JWT token
        const token = user.generateAuthToken();
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        // Remove password from response
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
        };
        // Send success response
        res.status(200).json({
            status: 'success',
            token,
            user: userResponse,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error logging in',
        });
    }
};
exports.login = login;
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
    try {
        // Clear cookie
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error logging out',
        });
    }
};
exports.logout = logout;
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.user?.id);
        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                isAdmin: user.isAdmin,
                stats: user.stats,
                rating: user.rating,
            },
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user data',
        });
    }
};
exports.getCurrentUser = getCurrentUser;
