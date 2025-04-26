import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { isBay } from "./lib/is-bay";
import { db } from "./lib/redis";

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

async function isBayDomain(origin: string) {
  const isBayVal = await db.get<boolean>(`is-bay:${origin}`);
  if (isBayVal === null) {
    console.log("Checking if", origin, "is a bay domain");
    const data = origin.split(":");
    const host = data[0];
    const port = data[1] ?? undefined;

    const response = await fetch(
      port ? `http://${host}:${port}/api/is-bay` : `https://${host}/api/is-bay`
    );
    const { token } = await response.json();
    await db.set(`is-bay:${origin}`, isBay(token), { ex: 60 * 5 });
    return isBayVal;
  }
  return isBayVal;
}

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const url = request.nextUrl;

  if (url.pathname.startsWith("/api/auth")) {
    const origin =
      request.headers.get("origin") ?? request.headers.get("host") ?? "";
    const isAllowedOrigin = await isBayDomain(origin);

    // Handle preflighted requests
    const isPreflight = request.method === "OPTIONS";

    if (isPreflight) {
      const preflightHeaders = {
        ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
        ...corsOptions,
      };
      return NextResponse.json({}, { headers: preflightHeaders });
    }

    // Handle simple requests
    const response = NextResponse.next();

    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  if (!sessionCookie && url.pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/login", url));
  }

  if (sessionCookie && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/app", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/app/:path*", "/login"], // Specify the routes the middleware applies to
};
