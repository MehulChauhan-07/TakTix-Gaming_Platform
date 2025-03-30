import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface Environment {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  FRONTEND_URL: string;
}

// Environment configuration
const env: Environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/taktix",
  JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret_for_development",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "30d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

// Validate critical environment variables
const validateEnv = (): void => {
  if (!process.env.JWT_SECRET && env.NODE_ENV === "production") {
    console.error(
      "⚠️  WARNING: JWT_SECRET is not set in production environment"
    );
  }

  if (!process.env.MONGODB_URI) {
    console.warn(
      "⚠️  WARNING: MONGODB_URI is not set, using default localhost connection"
    );
  }
};

// Run validation
validateEnv();

export default env;
