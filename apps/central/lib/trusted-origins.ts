import { getDeploymentAliases } from "./deployments";

export interface TrustedOrigin {
  origin: string;
  hostname: string;
}

export async function getTrustedOrigins(): Promise<TrustedOrigin[]> {
  const baseOrigins = process.env.VERCEL != "1"
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
        return {
          origin: url.origin,
          hostname: url.hostname
        };
      } catch {
        console.warn(`Invalid URL: ${origin}`);
        return null;
      }
    })
    .filter((url): url is TrustedOrigin => url !== null);
}

export function filterTrustedOrigins(
  origins: TrustedOrigin[],
  host: string | null,
  requestOrigin: string | null
): string[] {
  return origins
    .filter((url) => {
      if (!url) return false;
      
      // Special handling for localhost
      if (url.hostname === 'localhost' && (host === 'localhost' || host?.startsWith('localhost:') || requestOrigin?.includes('localhost'))) {
        return true;
      }

      return (
        url.hostname === host ||
        url.hostname === requestOrigin ||
        url.hostname === requestOrigin?.replace(/^https?:\/\//, "")
      );
    })
    .map((url) => url.origin);
}