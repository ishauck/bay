import { filterTrustedOrigins } from "@/lib/trusted-origins";

import { getTrustedOrigins } from "@/lib/trusted-origins";
import { log } from "next-axiom";

export async function GET(request: Request) {
  console.log("[redirect] Processing redirect request");
  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get("url");
  const domain = url.searchParams.get("domain");
  log.debug("[redirect] Request params:", { redirectUrl, domain });

  const origins = await getTrustedOrigins();
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  log.debug("[redirect] Request headers:", { host, origin });

  const trustedOrigins = filterTrustedOrigins(origins, host, origin);
  log.debug("[redirect] Trusted origins:", trustedOrigins);
  if (!trustedOrigins.includes(domain ?? "")) {
    log.debug("[redirect] Domain not trusted:", { domain });
    return Response.redirect(new URL("/", domain ?? ""));
  }

  if (!redirectUrl || !domain) {
    log.debug("[redirect] Missing required parameters");
    return Response.redirect(new URL("/", domain ?? ""));
  }

  const sessionToken = request.headers
    .get("cookie")
    ?.split(";")
    .find((c) => c.trim().startsWith("better-auth.session_token="))
    ?.split("=")[1];
  log.debug("[redirect] Session token present:", { sessionToken });

  const data = new URL(`/apply-token?url=${encodeURIComponent(redirectUrl)}&session_token=${encodeURIComponent(sessionToken ?? "")}`, domain);
  log.debug("[redirect] Final redirect URL:", { url: data.toString() });

  return Response.redirect(data);
}
