const codeInput = document.getElementById("codeInput");
const reviewBtn = document.getElementById("reviewBtn");
const output = document.getElementById("output");

reviewBtn.addEventListener("click", async () => {
    reviewBtn.disabled = true;
    console.log("Button clicked!");

    output.textContent = "Reviewing...";

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
    `;

    output.innerHTML = html;

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
