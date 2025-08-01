import mongoose, { models, model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  userName: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  emailToken?: string;
  password: string;
  role: string;
  // phoneNumber: number;
  // otp?: string;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    fullName: String,
    email: {
      type: String,
      unique: true,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please use a valid email address.",
      ],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // phoneNumber: {
    //   type: Number,
    //   required: true,
    // },
    // otp: String,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    return next(err as Error);
  }
});

export const userModel =
  (models?.users as mongoose.Model<IUser>) || model<IUser>("users", userSchema);
