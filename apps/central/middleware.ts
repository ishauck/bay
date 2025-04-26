import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";


export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const url = request.nextUrl;
 
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