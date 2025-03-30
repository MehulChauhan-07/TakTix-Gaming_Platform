import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleCastErrorDB = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired! Please log in again.", 401);
};

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Production vs Development error handling
  if (process.env.NODE_ENV === "development") {
    // Send detailed error in development
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // In production, handle operational errors properly
    let error = { ...err };
    error.message = err.message;

    // Mongoose CastError (Invalid MongoDB ID)
    if (err instanceof mongoose.Error.CastError) {
      error = handleCastErrorDB(err);
    }
    
    // MongoDB duplicate key error
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }
    
    // Mongoose Validation Error
    if (err instanceof mongoose.Error.ValidationError) {
      error = handleValidationErrorDB(err);
    }
    
    // JWT Error
    if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    
    // JWT Expired Error
    if (err.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    // Send error response
    if (error.isOperational) {
      // Operational, trusted error: send message to client
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    } else {
      // Programming or other unknown error: don't leak error details
      console.error("ERROR 💥", error);
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
};

export default errorMiddleware;
