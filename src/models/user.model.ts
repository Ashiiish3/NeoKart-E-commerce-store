import { models, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: number;
  otp?: number;
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
    },
    password: String,
    phoneNumber: Number,
    otp: Number,
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

export const userModel = models?.users || model<IUser>("users", userSchema);
