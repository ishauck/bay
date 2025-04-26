import jwt from "jsonwebtoken";
import { env } from "./env";

export const isBay = async (token: string, host?: string) => {
  try {
    const decoded = jwt.verify(token, env.AUTH_UNION_SECRET);
    if (host && decoded.sub !== host) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
