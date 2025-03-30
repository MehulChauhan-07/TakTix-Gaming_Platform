"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Environment configuration
const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/taktix',
    JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret_for_development',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
// Validate critical environment variables
const validateEnv = () => {
    if (!process.env.JWT_SECRET && env.NODE_ENV === 'production') {
        console.error('⚠️  WARNING: JWT_SECRET is not set in production environment');
    }
    if (!process.env.MONGODB_URI) {
        console.warn('⚠️  WARNING: MONGODB_URI is not set, using default localhost connection');
    }
};
// Run validation
validateEnv();
exports.default = env;
