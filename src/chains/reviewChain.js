import { ReviewSchema } from "../schemas/reviewSchema.js";
import { reviewPrompt } from "../prompts/reviewPrompt.js";
import { model } from "../models/gemini.js";

const structuredModel =
    model.withStructuredOutput(ReviewSchema);

export const reviewChain =
    reviewPrompt.pipe(structuredModel);