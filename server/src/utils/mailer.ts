import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail", // or your mail provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: "Poppins", sans-serif;">
        <h2>Verify your email</h2>
        <p>Use the following OTP to verify your account:</p>
        <h3 style="color: #6D28D9;">${otp}</h3>
        <p>This OTP is valid for 3 minutes.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// otpStore.ts
type OTPData = {
  otp: string;
  expiresAt: number;
};

const otpStore = new Map<string, OTPData>();

const generateKey = (email: string, purpose: string) => `${email}:${purpose}`;

export const saveOTP = (email: string, purpose: string, otp: string) => {
  const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes
  otpStore.set(generateKey(email, purpose), { otp, expiresAt });
};

export const verifyOTP = (email: string, purpose: string, otp: string) => {
  const data = otpStore.get(generateKey(email, purpose));
  if (!data) return false;

  if (Date.now() > data.expiresAt) {
    otpStore.delete(generateKey(email, purpose));
    return false;
  }

  const isValid = data.otp === otp;
  if (isValid) otpStore.delete(generateKey(email, purpose)); // use once
  return isValid;
};
