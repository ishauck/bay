import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
 
	if (!sessionCookie && request.nextUrl.pathname.startsWith("/app")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (sessionCookie && request.nextUrl.pathname === "/login") {
		return NextResponse.redirect(new URL("/app", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
	matcher: ["/app/:path*", "/login"], // Specify the routes the middleware applies to
};