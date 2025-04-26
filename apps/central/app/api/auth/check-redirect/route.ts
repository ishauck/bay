import { env } from "@/lib/env";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const keyData = Buffer.from(env.AUTH_UNION_SECRET);

/**
 * Handles GET requests to generate a JWT token.
 * This endpoint is used for authentication verification between services.
 * 
 * @returns A JSON response containing:
 *   - token: A JWT token containing a random nonce and expiration
 */
export async function GET() {
  // Generate a random 32-character string as nonce
  const nonce = crypto.randomUUID();
  
  // Create JWT with 5 minute expiration
  const token = jwt.sign(
    { nonce },
    keyData,
    { 
      algorithm: 'HS256',
      expiresIn: '30s'
    }
  );

  return NextResponse.json({ token });
}

export async function POST(request: Request) {
  const data = await request.json();
  const { token } = data;
  
  if (typeof token !== 'string') {
    throw new Error('token must be a string');
  }

  try {
    jwt.verify(token, keyData);
    return NextResponse.json({ isValid: true });
  } catch {
    // Token is invalid or expired
    return NextResponse.json({ isValid: false });
  }
}
