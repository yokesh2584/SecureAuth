import { Request, Response } from "express";
import { sendOTPEmail } from "../utils/mailer.js";
import { saveOTP, verifyOTP } from "../utils/mailer.js";

// @route POST/api/otp/send-otp
export const sendOtp = async (req: Request, res: Response) => {
  const { email, purpose } = req.body;

  if (!email || !purpose)
    return res.status(400).json({ error: "Email and purpose are required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  saveOTP(email, purpose, otp);

  try {
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// @route POST/api/otp/verify-otp
export const verifyOtp = (req: Request, res: Response) => {
  const { email, purpose, otp } = req.body;
  if (!email || !purpose || !otp)
    return res
      .status(400)
      .json({ message: "Email, Purpose and OTP are required" });

  const isValid = verifyOTP(email, purpose, otp);
  if (!isValid)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  res.status(200).json({ message: "OTP verified successfully" });
};
