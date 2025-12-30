document.addEventListener("DOMContentLoaded", function () {
    // Login button functionality
    const loginBtn = document.getElementById("loginBtn");
    const loginScreen = document.getElementById("loginScreen");
    const mainContent = document.getElementById("mainContent");

    if (loginBtn && loginScreen && mainContent) {
        loginBtn.addEventListener("click", () => {
            const emailInput = document.getElementById("emailInput").value.trim();
            const passwordInput = document.getElementById("passwordInput").value.trim();

            if (emailInput && passwordInput) {
                loginScreen.style.display = "none";
                const loginCard = document.getElementById("loginCard");
                if (loginCard) loginCard.style.display = "none";
                mainContent.style.display = "block";
            } else {
                alert("Please enter both email and password.");
            }
        });
    }

    // Get all necessary elements
    const generateBtn = document.getElementById('generateBtn');
    const saveBtn = document.getElementById('saveBtn');
    const taskType = document.getElementById('taskType');
    const tone = document.getElementById('tone');
    const topic = document.getElementById('topic');
    const output = document.getElementById('output');
    const savedPromptsList = document.getElementById('savedPrompts');
    const loadingIndicator = document.getElementById("loadingIndicator");

    // Hide the loading indicator initially
    if (loadingIndicator) loadingIndicator.style.display = "none";

    // Increase font size for output and error messages
    if (output) output.style.fontSize = "16px";

    // Dark mode toggle logic
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
        });
    }

    // Function to render saved prompts
    function renderSavedPrompts() {
        savedPromptsList.innerHTML = '';
        const saved = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
        saved.forEach((prompt, index) => {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = prompt;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = '✕';
            removeBtn.addEventListener('click', () => {
                const savedArray = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
                savedArray.splice(index, 1);
                localStorage.setItem('savedPrompts', JSON.stringify(savedArray));
                renderSavedPrompts();
            });

            li.appendChild(span);
            li.appendChild(removeBtn);
            savedPromptsList.appendChild(li);
        });
    }

    // Load saved prompts on page load
    renderSavedPrompts();

    // Generate Button Listener - calls local Node.js server
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            const task = taskType.value.trim();
            const selectedTone = tone.value.trim();
            const topicText = topic.value.trim();

            if (!task || !selectedTone || !topicText) {
                output.value = '⚠️ Please select a task type, tone, and enter a topic.';
                return;
            }

            loadingIndicator.style.display = "block";
            generateBtn.disabled = true;
            output.value = "";

            try {
                const response = await fetch("http://localhost:3000/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        task: task,
                        tone: selectedTone,
                        topic: topicText
                    })
                });

                const data = await response.json();
                if (data && data.prompt) {
                    output.value = data.prompt;
                } else {
                    output.value = "Failed to generate prompt. Try again.";
                }
            } catch (error) {
                console.error(error);
                alert("Error generating prompt. Check console for details.");
            } finally {
                loadingIndicator.style.display = "none";
                generateBtn.disabled = false;
            }
        });
    }

    // Save Prompt Button Listener - only saves when clicked
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (output.value.trim()) {
                const saved = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
                saved.unshift(output.value.trim());
                localStorage.setItem('savedPrompts', JSON.stringify(saved));
                renderSavedPrompts();
            }
        });
    }

    // Copy button functionality using Clipboard API with temporary text change
    const copyBtn = document.getElementById("copyBtn");
    const outputArea = document.getElementById("output");

    if (copyBtn && outputArea) {
        copyBtn.addEventListener("click", async () => {
            const text = outputArea.value.trim();
            if (!text) return;

            try {
                await navigator.clipboard.writeText(text);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Copied!";
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        });
    }
});
