import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const verifyPassword = async (
  password: string,
  userPassword: string
) => {
  return bcrypt.compare(password, userPassword);
};
