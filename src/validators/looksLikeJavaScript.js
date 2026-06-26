// const patterns = [
//     "function",
//     "const",
//     "let",
//     "var",
//     "=>",
//     "=",
//     ";",
//     "{",
//     "}",
//     "(",
//     ")",
//     "class",
//     "import",
//     "export",
//     "if",
//     "for",
//     "while",
//     "return"
// ];

// export function looksLikeJavaScript(code) {
//     return patterns.some(pattern => code.includes(pattern));
// }


const patterns = [
    /\bfunction\b/,
    /\bconst\b/,
    /\blet\b/,
    /\bvar\b/,
    /\bclass\b/,
    /\bimport\b/,
    /\bexport\b/,
    /\breturn\b/,
    /\bif\b/,
    /\bfor\b/,
    /\bwhile\b/,
    /=>/,
    /console\./,
    /[{}();=]/
];

export function checkJavaScript(req, res, next) {
    const { code } = req.body;

    const looksLikeJS = patterns.some(pattern => pattern.test(code));

    if (!looksLikeJS) {
        return res.status(400).json({
            success: false,
            error: "Input doesn't appear to be JavaScript."
        });
    }

    next();
}