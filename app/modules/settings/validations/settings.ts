import { z } from "zod";

export const settings = z.object({
  logo: z.string().url().optional(),
  primaryColor: z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/).optional(),
  secondaryColor: z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/).optional(),
});

export type SettingsType = z.infer<typeof settings>;