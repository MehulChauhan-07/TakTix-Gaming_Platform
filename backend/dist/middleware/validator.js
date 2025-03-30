"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const errorMiddleware_1 = require("./errorMiddleware");
// Middleware to validate request
const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));
        // Get validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        // Format errors
        const extractedErrors = {};
        errors.array().forEach(err => {
            if (err.type === 'field') {
                extractedErrors[err.path] = err.msg;
            }
        });
        // Return formatted errors
        const errorMessage = `Validation error: ${JSON.stringify(extractedErrors)}`;
        next(new errorMiddleware_1.AppError(errorMessage, 400));
    };
};
exports.validate = validate;
