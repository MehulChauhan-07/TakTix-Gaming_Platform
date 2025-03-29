import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
  name: string;
  slug: string;
  description: string;
  rules: string;
  imageUrl: string;
  maxPlayers: number;
  minPlayers: number;
  gameSettings: Record<string, any>;
  isActive: boolean;
}

const GameSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Game name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Game slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Game description is required"],
    },
    rules: {
      type: String,
      required: [true, "Game rules are required"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    maxPlayers: {
      type: Number,
      required: [true, "Maximum number of players is required"],
    },
    minPlayers: {
      type: Number,
      required: [true, "Minimum number of players is required"],
      default: 2,
    },
    gameSettings: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IGame>("Game", GameSchema);
