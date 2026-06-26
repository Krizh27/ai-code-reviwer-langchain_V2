import { z } from "zod";

export const InputSchema = z.object({
    code: z
        .string()
        .trim()
        .min(5, "Code must be at least 5 characters long.")
        .max(5000, "Code exceeds the maximum length.")
});