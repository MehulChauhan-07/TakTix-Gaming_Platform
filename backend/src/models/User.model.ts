import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  isAdmin: boolean;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    gamesDraw: number;
  };
  rating: number;
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: [200, "Bio cannot exceed 200 characters"],
    },
    stats: {
      gamesPlayed: { type: Number, default: 0 },
      gamesWon: { type: Number, default: 0 },
      gamesLost: { type: Number, default: 0 },
      gamesDraw: { type: Number, default: 0 },
    },
    rating: {
      type: Number,
      default: 1000,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { id: this._id.toString() },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    } as SignOptions
  );
};

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export default mongoose.model<IUser>("User", UserSchema);
