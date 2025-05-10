import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  // Basic Auth & Identification
  studentID: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"], // Simple email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Ensures password is never returned in queries unless explicitly requested
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // Roles & Permissions
  role: {
    type: String,
    enum: ["student", "admin"], // Controls app access
    default: "student",
  },
});

// Hash password ONLY if it's modified (or new)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt (10 rounds)
    this.password = await bcrypt.hash(this.password, salt); // Hash with salt
    next();
  } catch (err) {
    next(err);
  }
});

// Add a method to compare passwords (for login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new Error(
      "Password comparison failed - no password stored in user object"
    );
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
