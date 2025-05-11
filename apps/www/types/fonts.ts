import { z } from "zod";

const WebfontAxisSchema = z.object({
  tag: z.string(),
  start: z.number(),
  end: z.number(),
});

const WebfontSchema = z.object({
  kind: z.literal("webfonts#webfont"),
  family: z.string(),
  variants: z.array(z.string()),
  subsets: z.array(z.string()),
  version: z.string(),
  lastModified: z.string().refine((date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
  }, {
    message: "Invalid date format. Expected format: YYYY-MM-DD"
  }),
  files: z.record(z.string()), // Key is the variant name, value is the URL
  category: z.enum([
    "serif",
    "sans-serif",
    "monospace",
    "display",
    "handwriting",
  ]),
  menu: z.string(),
  axes: z.array(WebfontAxisSchema).optional(), // Present only upon request for variable fonts
});

const WebfontListSchema = z.object({
  kind: z.literal("webfonts#webfontList"),
  items: z.array(WebfontSchema),
});

const ErrorDetailSchema = z.object({
  message: z.string(),
  domain: z.string(),
  reason: z.string(),
});

const ErrorInfoDetailSchema = z.object({
  '@type': z.literal('type.googleapis.com/google.rpc.ErrorInfo'),
  reason: z.string(),
  domain: z.string(),
  metadata: z.record(z.string()),
});

const LocalizedMessageDetailSchema = z.object({
  '@type': z.literal('type.googleapis.com/google.rpc.LocalizedMessage'),
  locale: z.string(),
  message: z.string(),
});

const ErrorSchema = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
    errors: z.array(ErrorDetailSchema),
    status: z.string(),
    details: z.array(z.union([
      ErrorInfoDetailSchema,
      LocalizedMessageDetailSchema
    ])),
  }),
});

export type WebfontList = z.infer<typeof WebfontListSchema>;
export type ErrorSchema = z.infer<typeof ErrorSchema>;

export { WebfontListSchema, WebfontSchema, WebfontAxisSchema, ErrorSchema };
