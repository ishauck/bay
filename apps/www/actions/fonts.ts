'use server'

import { getFonts } from "@/lib/fonts";

export async function getFontsAction() {
  const fonts = await getFonts();

  return fonts.items.map((font) => ({
    family: font.family,
    variants: font.variants,
    subsets: font.subsets,
    files: font.files
  }));
}