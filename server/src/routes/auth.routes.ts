import express from "express";
import {
  preLoginCheck,
  preRegisterCheck,
  registerUser,
  loginUser,
  deleteUser,
  logoutUser,
  resetPassword,
  handleRefreshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/pre-login-check", preLoginCheck);
router.post("/pre-register-check", preRegisterCheck);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/reset-password", resetPassword);
router.delete("/delete-user", deleteUser);
router.get("/refresh-token", handleRefreshToken);

export default router;
