import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@/lib/env";

// Generates a unique one-minute JWT with the hostname as the payload
export async function GET(request: NextRequest) {
  const host = request.headers.get("host");
  const token = jwt.sign({ "sub": host }, env.AUTH_UNION_SECRET, { expiresIn: "1m" });

  return NextResponse.json({ token });
}