import express from "express";


import { reviewChain } from "./chains/reviewChain.js";
import { validateInput } from "./validators/validateInput.js";
import { checkJavaScript } from "./validators/looksLikeJavaScript.js";
import { checkPromptInjection } from "./validators/detectPromptInjection.js";


const app = express();


app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("AI Code Reviewer API");
});

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

app.post(
    "/review",
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
            console.error(err);

            res.status(500).json({
                success: false,
                error: "Review failed"
            });
        }
    }
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
