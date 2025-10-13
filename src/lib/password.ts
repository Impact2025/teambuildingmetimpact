import bcrypt from "bcryptjs";

const ROUNDS = 12;

export const hashPassword = async (plain: string) => {
  return bcrypt.hash(plain, ROUNDS);
};

export const verifyPassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};
