import { Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { AppError } from "../middleware/errorMiddleware";
import mongoose from "mongoose";

// Helper function to generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  } as SignOptions);
};

// Helper function to send token response
const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
  // Create token
  const token = generateToken((user._id as mongoose.Types.ObjectId).toString());

  const cookieOptions = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
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
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
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
    const user = new User({
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
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating user',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error logging in',
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req: Request, res: Response): void => {
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
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error logging out',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    
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
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user data',
    });
  }
};
