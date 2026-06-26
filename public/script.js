const codeInput = document.getElementById("codeInput");
const reviewBtn = document.getElementById("reviewBtn");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");


reviewBtn.addEventListener("click", async () => {
    reviewBtn.disabled = true;
    console.log("Button clicked!");

    output.textContent = "Reviewing...";
    copyBtn.textContent = "Copy Fixed Code";
    copyBtn.style.display = "none";

    const code = codeInput.value;
    console.log(code);

    try {
    const response = await fetch("/review", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
    });

    const data = await response.json();

    // ❗ HANDLE ERROR RESPONSE FROM BACKEND
    if (!response.ok) {
        output.innerHTML = `
            <div class="error">
                ❌ ${data.error || "Something went wrong"}
            </div>
        `;
        return;
    }

    // SUCCESS UI
    let html = `<h2>Problems</h2>`;

    if (data.review.problems.length === 0) {
        html += `<p>None 🎉</p>`;
    } else {
        data.review.problems.forEach(problem => {
            html += `
            <div class="problem">
                <h3>${problem.type}</h3>
                <p>${problem.description}</p>
            </div>
            `;
        });
    }

    html += `
        <h2>Fixed Code</h2>
        <pre><code>${data.review.fixedCode}</code></pre>
        <p><span>Processing Time: </span>${data.processingTime} ms</p>
    `;

    output.innerHTML = html;
    copyBtn.style.display = "inline-block";

} catch (err) {
    console.error(err);

    output.innerHTML = `
        <div class="error">
            ⚠️ Network error or server is down
        </div>
    `;
} finally {
    reviewBtn.disabled = false;
}
});

codeInput.addEventListener("input", () => {
    copyBtn.textContent = "Copy Fixed Code";
    copyBtn.style.display = "none";
});

copyBtn.addEventListener("click", () => {
    const codeElement = output.querySelector("pre code");
    if (codeElement) {
        navigator.clipboard.writeText(codeElement.textContent).then(() => {
            copyBtn.textContent = "Copied";
        }).catch(err => {
            console.error("Failed to copy code: ", err);
        });
    }
});
