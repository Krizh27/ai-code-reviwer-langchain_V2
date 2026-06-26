import { z } from "zod";

export const ReviewSchema = z.object({
    // success: z.boolean(),
    // tokensUsed: z.number(), //later upgrade
    problems: z.array(
        z.object({
            type: z.string(),
            description: z.string(),
        })
    ),
    fixedCode: z.string(),
});