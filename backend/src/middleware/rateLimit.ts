import rateLimit from 'express-rate-limit';

// Rate limiting for all requests
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Rate limiting for authentication requests
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'development' ? 20 : 5, // Higher limit in development
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  message: 'Too many login attempts from this IP, please try again after an hour',
});

// Rate limiting for game moves
export const gameLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 game moves per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many game moves, please slow down',
});
