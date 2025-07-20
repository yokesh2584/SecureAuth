export type Role = "admin" | "user";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: Role;
  createdAt: Date;
  updatedAt: Date;
}
