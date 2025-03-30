import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { AppError } from "./errorMiddleware";

// Interface for decoded JWT token
interface IDecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Function to verify a token and return user
export const verifyToken = async (token: string): Promise<IUser | null> => {
  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as IDecodedToken;

    // Get user from the token
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
};

// Middleware to protect routes
export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header or cookie
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No authentication token, access denied', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };

    // Get user from token
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

// Middleware to check if user is admin
export const admin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new AppError("Not authorized as an admin", 403));
  }
};
