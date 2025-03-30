"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const auth_Routes_1 = __importDefault(require("./routes/auth.Routes"));
const user_Routes_1 = __importDefault(require("./routes/user.Routes"));
const game_Routes_1 = __importDefault(require("./routes/game.Routes"));
const leaderboard_routes_1 = __importDefault(require("./routes/leaderboard.routes"));
const tournament_routes_1 = __importDefault(require("./routes/tournament.routes"));
const rateLimit_1 = require("./middleware/rateLimit");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['set-cookie']
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
// Rate limiting
app.use(rateLimit_1.globalLimiter);
// Use morgan logger only in development
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)("dev"));
}
// Routes
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "TakTix Gaming Platform API",
        version: "1.0.0",
    });
});
// Apply specific rate limiters to sensitive routes
app.use("/api/auth/login", rateLimit_1.authLimiter);
app.use("/api/auth/register", rateLimit_1.authLimiter);
// API routes
app.use("/api/auth", auth_Routes_1.default);
app.use("/api/users", user_Routes_1.default);
app.use("/api/games", game_Routes_1.default);
app.use("/api/leaderboards", leaderboard_routes_1.default);
app.use("/api/tournaments", tournament_routes_1.default);
// Error handling
app.use(errorMiddleware_1.default);
// 404 Route
app.use("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} not found`,
    });
});
exports.default = app;
