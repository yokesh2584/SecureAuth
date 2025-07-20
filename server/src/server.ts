import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import optRoutes from "./routes/otp.routes.js";

export const createServer = () => {
  dotenv.config();
  const app = express();
  const clientUrl = process.env.CLIENT_URL!;

  app.use(cors({ origin: clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get(["/", "/api"], (_req: Request, res: Response) => {
    res.send("SecureAuth server is running....");
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/otp", optRoutes);

  return app;
};
