import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address",
    ],
  },
  password: { type: String, select: false },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiresIn: { type: Date, expires: 0, default: null },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

userSchema.index({ email: 1 }, { unique: true });
// validating and hashing password
userSchema.pre("save", async function () {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.otp && this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }
  if (!this.username || this.username.length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }
  if (!this.email || this.email.length < 8) {
    throw new Error("Email must be at least 8 characters long");
  }
});
const userModel = mongoose.model("user", userSchema);

export default userModel;
