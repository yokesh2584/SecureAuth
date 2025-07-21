import { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../utils/bcrypt.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

// JWT_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

// Is in Production?
const isInProduction = process.env.NODE_ENV === "production";

// Cookie expiry
const sevenDays = 7 * 24 * 60 * 60 * 1000;
const twentyOneDays = 21 * 24 * 60 * 60 * 1000;

// @route POST/api/auth/pre-login-check
export const preLoginCheck = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.status(200).json({ message: "User found" });
};

// @route POST/api/auth/pre-register-check
export const preRegisterCheck = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const existingUserEmail = await UserModel.findOne({ email });
  const existingUsername = await UserModel.findOne({ name });

  if (existingUserEmail)
    return res.status(409).json({ message: "Email already registered" });
  if (existingUsername)
    return res.status(409).json({ message: "Username already exist" });

  return res.status(200).json({ message: "Email and Username not registered" });
};

// @route POST/api/auth/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // checks whether all fields are provided or not
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // checks if the email already registered
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // hash password
    const hashedPassword = await hashPassword(password);

    // creates new user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // generate token
    const accessToken = createAccessToken(newUser._id);
    const refreshToken = createRefreshToken(newUser._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isInProduction, // true only in production with https
      sameSite: "none",
      path: "/api/auth/refresh-token",
      maxAge: sevenDays,
    });

    // sent response with message, user object and token
    return res.status(201).json({
      message: "User created successfully",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
      accessToken,
    });
  } catch (error) {
    // logs error and return error message
    const errorMessage =
      error instanceof Error ? error.message : "Server error";
    return res.status(500).json({ message: errorMessage });
  }
};

// @route POST/api/auth/login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    // checks are fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // checks email exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // verify password matches
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isInProduction, // true only in production with https
      sameSite: "none",
      path: "/api/auth/refresh-token",
      maxAge: rememberMe ? twentyOneDays : sevenDays,
    });

    return res.status(200).json({
      message: "LoggedIn successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server error";
    return res.status(500).json({ message: errorMessage });
  }
};

// @route DELETE/api/auth/delete-user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not exist" });
    }

    await user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Server error";
    return res.status(500).json({ message: errorMessage });
  }
};

// @route POST/api/auth/logout
export const logoutUser = async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh-token",
  });
  res.status(200).json({ message: "Logged out" });
};

// @route POST/api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, verified, newPassword } = req.body;

  if (!verified)
    return res.status(401).json({ message: "Email is not verified" });

  if (!email || !newPassword) {
    return res
      .status(400)
      .json({ error: "Email and new password are required" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// @route GET/api/auth/refresh-token
export const handleRefreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken as string;
  if (!token)
    return res.status(400).json({ message: "No refresh token found" });

  try {
    const decoded = verifyRefreshToken(token, REFRESH_TOKEN_SECRET);
    const accessToken = createAccessToken(decoded.userId);
    return res.status(200).json({ accessToken });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Invalid or expired token.";
    return res.status(403).json({ message: errorMessage });
  }
};
