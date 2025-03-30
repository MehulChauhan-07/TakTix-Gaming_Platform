"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    jwtSecret: process.env.JWT_SECRET || "your-secret-token",
    jwtExpire: process.env.JWT_EXPIRES || "30d",
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    mongoURI: process.env.MONGODB_URI || "mongodb://localhost:27017/taktix",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
