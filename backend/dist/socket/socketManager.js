"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const gameHandlers_1 = require("./gameHandlers");
const auth_1 = require("../middleware/auth");
const setupSocketHandlers = (io) => {
    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const user = await (0, auth_1.verifyToken)(token);
            if (!user) {
                return next(new Error('Authentication error'));
            }
            // Attach user data to socket
            socket.data.user = user;
            next();
        }
        catch (error) {
            console.error('Socket authentication error:', error);
            next(new Error('Authentication error'));
        }
    });
    // Handle new connections
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Join user to their personal room
        if (socket.data.user) {
            socket.join(socket.data.user.id);
        }
        // Register all event handlers
        (0, gameHandlers_1.registerGameHandlers)(io, socket);
        // Add more handlers here as needed
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
