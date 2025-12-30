// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Insert your temporary key locally here for testing
const API_KEY = "AIzaSyA1vWjj4W9bzA51shAmJegre7rvKXuUZHs";

app.post("/generate", async (req, res) => {
  const { task, tone, topic } = req.body;

  try {
    // Replace 'YOUR_VALID_MODEL_HERE' with a model name returned by ListModels
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${"AIzaSyA1vWjj4W9bzA51shAmJegre7rvKXuUZHs"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Task: ${task}\nTone: ${tone}\nTopic: ${topic}\nGenerate a useful writing prompt.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini response:", data);

    if (data.candidates && data.candidates.length > 0) {
      res.json({ prompt: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: "No prompt generated" });
    }
  } catch (err) {
    console.error("Error fetching from Gemini:", err);
    res.status(500).json({ error: "Failed to generate prompt" });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));