import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  chatHistory: { message: string; response: string; timestamp: Date }[];
  preferences: Record<string, any>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  chatHistory: [
    {
      message: { type: String, required: true },
      response: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  preferences: { type: Object, default: {} },
});

// Ensure the model is only compiled once to avoid errors during hot reloads
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
