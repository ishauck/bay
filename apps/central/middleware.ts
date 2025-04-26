import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { isBay } from "./lib/is-bay";
import { db } from "./lib/redis";


export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const url = request.nextUrl;

	// Handle CORS for auth endpoints
	if (url.pathname.startsWith('/api/auth')) {
		const response = NextResponse.next();
		const host = request.headers.get("host");
		let isHostBay = await db.get<boolean>(`is-bay:${host}`);

		if (host === process.env.VERCEL_URL) {
			isHostBay = true;
		}

		if (isHostBay === null || isHostBay === undefined) { // If the host is not in the database, check if it is a bay
			const token = await fetch(`${host}/api/is-bay`, {
				headers: {
					"Host": process.env.VERCEL_URL ?? "",
				},
			});
			const tokenJson = await token.json();
			isHostBay = await isBay(tokenJson.token, host ?? "");
			
			await db.set(`is-bay:${host}`, isHostBay);
		}

		// Add CORS headers
		response.headers.set('Access-Control-Allow-Origin', host ?? "");
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		response.headers.set('Access-Control-Allow-Credentials', 'true');

		// Return the response with CORS headers for both OPTIONS and non-OPTIONS requests
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