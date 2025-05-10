import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";
dotenv.config();

// JSON Web Token helper function
const jwtSecret = process.env.JWT_SECRET;
async function generateJWT(res, userId) {
  // Create JWT
  const token = jwt.sign({ userId }, jwtSecret);
  console.log("New json token was created.");

  // Save JWT in browser cookies
  res.clearCookie("jwt");
  res.cookie("jwt", token, { httpOnly: true });
}
/**
 * @description Only return the fields that is required to the frontend for safety
 */
// TODO: If needed field in frontend is not available add it here.
const sanitizeUser = (user) => ({
  studentID: user.studentID,
  email: user.email,
  username: user.username,
  ordersPlaced: user.ordersPlaced,
});

/**
 * @desc    Registers the user
 * @route   POST /server/users/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  if (
    !req.body.username ||
    !req.body.studentID ||
    !req.body.email ||
    !req.body.password
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields." });
  }

  if (
    (await User.findOne({ studentID: req.body.studentID })) ||
    (await User.findOne({ email: req.body.email }))
  ) {
    return res.status(409).json({
      success: false,
      message: "StudentID or Email has already been registered!",
    });
  }

  try {
    const user = await User.create({
      studentID: req.body.studentID,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    generateJWT(res, user._id); // Generate JWT for user and save in cookie
    return res.status(200).json({
      success: true,
      message: "Account created",
      data: sanitizeUser(user),
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};

/**
 * @desc    Login the user
 * @route   POST /server/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  // If check if all fields are provided
  if (!req.body.studentID || !req.body.username || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields.",
    });
  }
  // Check if user exists
  // Make sure to add the password back to the user to check for validation
  const validUser = await User.findOne({
    studentID: req.body.studentID,
  }).select("+password");

  if (!validUser) {
    return res.status(404).json({
      success: false,
      message: `${req.body.studentID} is not registered.`,
    });
  }

  const validPassword = await validUser.comparePassword(req.body.password);

  if (!validPassword) {
    return res.status(400).json({ success: false, message: "Wrong Password!" });
  }

  const validUsername = req.body.username === validUser.username;

  if (!validUsername) {
    return res.status(400).json({ success: false, message: "Wrong Username!" });
  }

  // Generate JWT for user and save in cookie
  generateJWT(res, validUser._id);

  const response = sanitizeUser(validUser);

  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: response,
  });
};

/**
 * @desc    Check if a user is currently authenticated to the system
 * @route   GET /server/users/loginStatus
 * @access  Public
 */
export const loginStatus = async (req, res) => {
  // Get the JWT Token from the browser cookies
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        "Unauthorised access, please create or sign in to an existing account.",
    });
  }
  try {
    // Verify the JWT Token with the secret hash
    const verifyToken = jwt.verify(token, jwtSecret);
    if (verifyToken) {
      const decodedToken = jwtDecode(token);
      const user = await User.findById(decodedToken.userId);

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found!" });
      }

      const response = sanitizeUser(user);
      return res.status(200).json({ success: true, data: response });
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
  return res.status(401).json({
    success: false,
    message:
      "Unauthorised access, please create or sign in to an existing account.",
  });
};

/**
 * @desc    Logout the user from the system
 * @route   GET /server/users/logout
 * @access  Public
 */
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error is logging out: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to logout" });
  }
};
