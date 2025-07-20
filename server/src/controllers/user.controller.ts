import { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";

export const getUsers = async (req: Request, res: Response) => {
  const users = await UserModel.find().select("name email role");

  if (!users || users.length === 0) {
    return res.status(401).json({ message: "No users found" });
  }

  const refinedUsers = users.map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  return res.status(200).json({ message: "Users found", refinedUsers });
};
