import { ErrorSchema, WebfontList, WebfontListSchema } from "@/types/fonts";
import { env } from "./env";

// In-memory cache for fonts
let fontsCache: WebfontList | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export async function getFonts(useCache: boolean = true) {
  // Check cache
  if (
    useCache &&
    fontsCache &&
    cacheTimestamp &&
    Date.now() - cacheTimestamp < CACHE_DURATION_MS
  ) {
    return fontsCache;
  }

  const response = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${env.GOOGLE_FONTS_API_KEY}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (WebfontListSchema.safeParse(data).success) {
    fontsCache = data as WebfontList;
    cacheTimestamp = Date.now();
    return fontsCache;
  }

  if (ErrorSchema.safeParse(data).success) {
    throw new Error("Failed to fetch fonts");
  }

  throw new Error("Invalid response from Google Fonts API");
}
