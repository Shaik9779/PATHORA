
const express = require("express");

const router = express.Router();

const LANGUAGE_CONFIG = {
  python: {
    language: "python",
    version: "3.10.0",
    filename: "main.py",
  },
  java: {
    language: "java",
    version: "15.0.2",
    filename: "Main.java",
  },
};

router.post("/run", async (req, res) => {
  try {
    const { language, code, input = "" } = req.body || {};

    if (!language || !code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please select a language and enter your code.",
      });
    }

    const config = LANGUAGE_CONFIG[language.toLowerCase()];

    if (!config) {
      return res.status(400).json({
        success: false,
        error: "Only Python and Java are supported.",
      });
    }

    const response = await fetch(
      "https://emkc.org/api/v2/piston/execute",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: config.language,
          version: config.version,
          files: [
            {
              name: config.filename,
              content: code,
            },
          ],
          stdin: input,
        }),
        signal: AbortSignal.timeout(20000),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: result.message || "The execution service returned an error.",
      });
    }

    return res.json({
      success: true,
      output: result.run?.stdout || "",
      stderr: result.run?.stderr || "",
      compileOutput: result.compile?.output || "",
      exitCode: result.run?.code ?? null,
      signal: result.run?.signal ?? null,
    });
  } catch (error) {
    console.error("Code runner error:", error.message);

    return res.status(502).json({
      success: false,
      error:
        error.name === "TimeoutError"
          ? "Code execution timed out. Try again."
          : "Could not reach the code execution service.",
    });
  }
});

module.exports = router;
