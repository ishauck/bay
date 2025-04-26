import jwt from "jsonwebtoken";
import { env } from "./env";

export const isBay = async (token: string, host: string) => {
  try {
    const decoded = jwt.verify(token, env.AUTH_UNION_SECRET);
    return decoded.sub === host;
  } catch {
    return false;
  }
};
