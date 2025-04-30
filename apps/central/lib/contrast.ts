import hexRgb from "hex-rgb";

export function contrast(hex: string) {
  const { red: r, green: g, blue: b } = hexRgb(hex);
  const o = Math.round((r * 299 + g * 587 + b * 114) / 1000);

  return o <= 180 ? "dark" : "light";
}
