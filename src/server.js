import express from "express";
import rateLimit from "express-rate-limit";


import { reviewChain } from "./chains/reviewChain.js";
import { validateInput } from "./validators/validateInput.js";
import { checkJavaScript } from "./validators/looksLikeJavaScript.js";
import { checkPromptInjection } from "./validators/detectPromptInjection.js";


const app = express();


app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;

// app.get("/", (req, res) => {
//     res.send("AI Code Reviewer API");
// });

// no need for get post as public static already uses index.html file directly

// app.post("/review", async (req, res) => {

//     // console.log(req.body);
//     // res.json({
//     //     success: true
//     // });
//     try{
//         const {code} = req.body;

//         if (!code) {
//             return res.status(400).json({
//                 success:false,
//                 error:"Code is required"
//             })
            
//         }
//         const start = Date.now();
        
//         const review = await reviewChain.invoke({
//             code,
//         })
//         const processingTime = Date.now()-start;

//         res.json({
//             success:true,
//             processingTime,
//             review
//         });
//     }catch(err){
//         console.error(err);
//        return res.status(500).json({
//             error:"review failed"
//         });
//     }

// });

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: {
        success: false,
        error: "Too many review requests. Please wait a few minutes and try again."
    },
});

app.post(
    "/review",
    limiter,
    validateInput,
    checkJavaScript,
    checkPromptInjection,
    async (req, res) => {

        try {
            const start = Date.now();

            const review = await reviewChain.invoke({
                code: req.body.code
            });

            const processingTime = Date.now() - start;

            res.json({
                success: true,
                processingTime,
                review
            });

        } catch (err) {
           console.error("Gemini Error:", err);

    const message =
        err?.message?.toLowerCase().includes("quota")
            ? "AI quota exceeded. Try again later."
            : err?.message?.toLowerCase().includes("api key")
            ? "Invalid API key configuration."
            : err?.message?.toLowerCase().includes("rate")
            ? "Too many requests. Please slow down or try again after some time."
            : "AI service failed. Please try again after some time.";

    return res.status(500).json({
        success: false,
        error: message
            });
        }
    }
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
