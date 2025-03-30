import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorMiddleware';

// Middleware to validate request
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Get validation errors
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const extractedErrors: Record<string, string> = {};
    errors.array().forEach(err => {
      if (err.type === 'field') {
        extractedErrors[err.path] = err.msg;
      }
    });

    // Return formatted errors
    const errorMessage = `Validation error: ${JSON.stringify(extractedErrors)}`;
    next(new AppError(errorMessage, 400));
  };
};
