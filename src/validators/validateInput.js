import { InputSchema } from "../schemas/inputSchema.js";

export function validateInput(req, res, next) {
    const result = InputSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: result.error.issues[0].message
        });
    }

    req.body = result.data;
    next();
}