import { z } from "zod";
import { FormPartial } from "./forms";
import { contrast } from "@/lib/contrast";

export const BackgroundTypeOptions = z.enum(["solid", "image"]);

export const StyleOptions = z.object({
  backgroundType: BackgroundTypeOptions.default("solid"),
  backgroundValue: z.string().default("#ffffff"),
  textColor: z.string().default("#000000"),
});

export function abstractStyleOptions(options: FormPartial) {
  return StyleOptions.parse(options);
}

export function generateCssProperties(options: StyleOptions, applyMode: 'directly' | 'as-css-var' | 'none' = 'as-css-var') {
  const isDark = contrast(options.backgroundValue);

  if (applyMode === 'directly') {
    const base: React.CSSProperties = {
      background: options.backgroundType === "image" ? `url(${options.backgroundValue})` : options.backgroundValue,
      color: options.textColor,
    };
    return base;
  }

  const base: React.CSSProperties & {
    '--question-background': string;
    '--question-text-color': string;
    '--question-background-type': string;
    '--question-is-dark': string;
  } = {
    '--question-background': options.backgroundValue,
    '--question-text-color': options.textColor,
    '--question-background-type': options.backgroundType,
    '--question-is-dark': isDark ? "true" : "false",
  };

  if (options.backgroundType === "image") {
    base['--question-background'] = `url(${options.backgroundValue})`;
  }

  if (applyMode !== 'none') {
    base['background'] = `var(--question-background)`;
    base['color'] = `var(--question-text-color)`;
  }

  return base as React.CSSProperties;
}

export type BackgroundType = z.infer<typeof BackgroundTypeOptions>;
export type StyleOptions = z.infer<typeof StyleOptions>;