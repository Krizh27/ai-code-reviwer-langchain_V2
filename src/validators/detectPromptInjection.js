const blocked = [
    "ignore previous",
    "ignore all previous",
    "system prompt",
    "act as",
    "pretend",
    "forget your instructions",
    "reveal your prompt",
    "you are chatgpt"
];

export function checkPromptInjection(req, res, next) {

    const text = req.body.code.toLowerCase();

    const detected = blocked.some(word => text.includes(word));

    if (detected) {
        return res.status(400).json({
            success: false,
            error: "Potential prompt injection detected."
        });
    }

    next();
}