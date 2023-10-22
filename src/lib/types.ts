import { z } from "zod";

export const terminalConfigSchema = z.object({
  name: z.string(),
  command: z.string(),
  color: z.string().optional(),
});
