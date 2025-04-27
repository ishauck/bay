import { getDeploymentAliases } from "./deployments";

export async function getTrustedOrigins(): Promise<URL[]> {
  const baseOrigins =
    process.env.VERCEL != "1"
      ? ["http://localhost:3000"]
      : [
          "http://localhost:3000",
          ...(await getDeploymentAliases()).aliases.map(
            (alias: { alias: string }) => `https://${alias.alias}`
          ),
        ];

  return baseOrigins
    .map((origin) => {
      try {
        const url = new URL(origin);
        return url;
      } catch {
        console.warn(`Invalid URL: ${origin}`);
        return null;
      }
    })
    .filter((url): url is URL => url !== null);
}

/**
 * Filters a list of trusted origins based on the current request's host and origin.
 * This function is used to validate if a request is coming from a trusted source.
 *
 * @param origins - List of trusted URLs to check against
 * @param host - The host header from the request
 * @param requestOrigin - The origin header from the request
 * @returns Array of trusted origin strings that match the current request
 */
export function filterTrustedOrigins(
  origins: URL[],
  host: string | null,
  requestOrigin: string | null
): string[] {
  return origins
    .map((url) => url.hostname)
    .filter((origin) => {
      if (!host || !requestOrigin) return false;
      return (
        origin === host ||
        origin === requestOrigin ||
        origin === requestOrigin.replace(/^https?:\/\//, "")
      );
    });
}
