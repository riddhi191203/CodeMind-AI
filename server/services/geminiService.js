import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c",
  "go",
  "rust",
  "php",
];

const MAX_CODE_CHARS = 14000;

const MODE_CONFIG = {
  review: {
    title: "AI Code Review",
    goal:
      "Analyze code quality, bugs, maintainability, security and performance.",
    instructions: `
- Detect syntax, runtime and logical issues.
- Include security risks.
- Include optimization opportunities.
- Include best practices.
- Include complexity analysis.
- Generate correctedCode if issues exist.
- Generate refactoredCode if optimization is possible.
`,
  },

  bugfix: {
    title: "AI Bug Fixer",
    goal:
      "Fix syntax, runtime and logical issues.",
    instructions: `
- Explain root cause clearly.
- Generate FULL corrected working code.
- correctedCode MUST contain full code.
- Never return placeholders.
`,
  },

  optimize: {
    title: "AI Optimizer",
    goal:
      "Improve performance and scalability.",
    instructions: `
- Reduce time complexity.
- Reduce space complexity.
- Improve scalability.
- Generate FULL optimized code.
`,
  },

  explain: {
    title: "AI Code Explainer",
    goal:
      "Explain code in beginner-friendly language.",
    instructions: `
- Explain line by line.
- Explain variables and functions.
- Keep explanations simple.
`,
  },

  error: {
    title: "AI Error Solver",
    goal:
      "Analyze and fix errors.",
    instructions: `
- Explain exact root cause.
- Explain how to fix it.
- Generate FULL corrected code.
- Add prevention tips.
`,
  },

  refactor: {
    title: "AI Refactor Engine",
    goal:
      "Refactor messy code into clean modular production-ready code.",
    instructions: `
- Improve readability.
- Improve naming.
- Reduce redundancy.
- Improve modularization.
- Generate FULL refactored code.
`,
  },

  complexity: {
    title: "AI Complexity Analyzer",
    goal:
      "Analyze algorithmic complexity.",
    instructions: `
- Include Big O analysis.
- Detect nested loops.
- Detect inefficient patterns.
- Suggest optimized approaches.
`,
  },

  format: {
    title: "Code Formatter",
    goal:
      "Beautify and properly format code.",
    instructions: `
- ONLY format code.
- DO NOT optimize.
- DO NOT explain.
`,
  },
};

const normalizeLanguage = (
  language = "javascript"
) => {
  const value = language
    .toLowerCase()
    .replace("c++", "cpp");

  return SUPPORTED_LANGUAGES.includes(value)
    ? value
    : "javascript";
};

const buildPrompt = ({
  code = "",
  language = "javascript",
  problemStatement = "",
  mode = "review",
  errorMessage = "",
  stackTrace = "",
  options = {},
}) => {
  const selectedMode =
    MODE_CONFIG[mode] ||
    MODE_CONFIG.review;

  return `
You are CodeMind.AI,
an elite senior software engineer and AI coding assistant.

TASK:
${selectedMode.title}

GOAL:
${selectedMode.goal}

SPECIAL INSTRUCTIONS:
${selectedMode.instructions}

LANGUAGE:
${normalizeLanguage(language)}

PROBLEM:
${problemStatement || "Not provided"}

ERROR MESSAGE:
${errorMessage || "Not provided"}

STACK TRACE:
${stackTrace || "Not provided"}

OPTIONS:
${JSON.stringify(options, null, 2)}

IMPORTANT RULES:

- Always generate COMPLETE WORKING CODE.
- Never say:
  "Provided above"
  "See above"
  "Same code"
  "Already shown"

- correctedCode MUST contain FULL code.
- refactoredCode MUST contain FULL code.

- Use proper markdown headings.
- Use bullet points.
- Use syntax highlighted markdown code blocks.
- Keep explanations concise and professional.
- Never repeat headings.
- Generate production-ready solutions.

RETURN A CLEAN MARKDOWN REPORT.

AT THE END RETURN STRICT VALID JSON:

\`\`\`json
{
  "qualityScore": 90,
  "summary": "",

  "suggestions": [],
  "optimizationOpportunities": [],
  "errorFixes": [],
  "bestPractices": [],
  "securityRisks": [],

  "complexity": {
    "time": "",
    "space": "",
    "inefficientPatterns": [],
    "recursionTips": []
  },

  "correctedCode": "",
  "refactoredCode": ""
}
\`\`\`

SOURCE CODE:

\`\`\`${normalizeLanguage(language)}
${code.slice(0, MAX_CODE_CHARS)}
\`\`\`
`;
};

const parseReportJson = (
  content = ""
) => {
  try {
    const match =
      content.match(
        /```json\s*([\s\S]*?)```/i
      );

    if (!match) return {};

    return JSON.parse(match[1]);
  } catch (error) {
    console.error(
      "JSON Parse Error:",
      error
    );

    return {};
  }
};

const cleanMarkdown = (
  content = ""
) => {
  return content

    // Remove JSON block
    .replace(
      /```json[\s\S]*?```/gi,
      ""
    )

    // Remove duplicate headings
    .replace(
      /## Corrected Code[\s\S]*?(?=##|$)/gi,
      ""
    )

    .replace(
      /## Refactored Code[\s\S]*?(?=##|$)/gi,
      ""
    )

    .replace(
      /## Optimized Code[\s\S]*?(?=##|$)/gi,
      ""
    )

    // Remove unwanted headings
    .replace(
      /#{1,6}\s*JSON Report/gi,
      ""
    )

    .replace(
      /#{1,6}\s*JSON Output/gi,
      ""
    )

    // Remove placeholders
    .replace(
      /Provided above/gi,
      ""
    )

    .replace(
      /See above/gi,
      ""
    )

    .replace(
      /Same code/gi,
      ""
    )

    // Fix spacing
    .replace(
      /\n{3,}/g,
      "\n\n"
    )

    .trim();
};

export const generateAIReport =
  async (request) => {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is missing"
      );
    }

    const completion =
      await groq.chat.completions.create({
        model:
          process.env.GROQ_MODEL ||
          "llama-3.3-70b-versatile",

        temperature: 0.1,

        messages: [
          {
            role: "system",
            content:
              "You are CodeMind.AI. Generate professional engineering analysis and production-grade code.",
          },

          {
            role: "user",
            content:
              buildPrompt(request),
          },
        ],
      });

    const rawContent =
      completion.choices?.[0]
        ?.message?.content || "";

    // Extract JSON internally only
    const report =
      parseReportJson(rawContent);

    const language =
      normalizeLanguage(
        request.language
      );

    // Prevent placeholder outputs
    if (
      report.correctedCode
        ?.toLowerCase()
        ?.includes("provided above")
    ) {
      report.correctedCode =
        request.code;
    }

    if (
      report.refactoredCode
        ?.toLowerCase()
        ?.includes("provided above")
    ) {
      report.refactoredCode =
        request.code;
    }

    // Clean markdown for frontend
    const cleanedContent =
      cleanMarkdown(rawContent);

    let finalContent = "";

    // ======================================
    // Corrected Code
    // ======================================

    if (
      report.correctedCode &&
      report.correctedCode.trim()
    ) {
      finalContent += `
# Corrected Code

\`\`\`${language}
${report.correctedCode.trim()}
\`\`\`

`;
    }

    // ======================================
    // Refactored Code
    // ======================================

    if (
      report.refactoredCode &&
      report.refactoredCode.trim()
    ) {
      finalContent += `
# Optimized / Refactored Code

\`\`\`${language}
${report.refactoredCode.trim()}
\`\`\`

`;
    }

    // ======================================
    // AI Analysis
    // ======================================

    if (cleanedContent) {
      finalContent += `
# AI Analysis

${cleanedContent}
`;
    }

    if (!finalContent.trim()) {
      finalContent =
        cleanedContent;
    }

    return {
      content:
        finalContent.trim(),

      review:
        finalContent.trim(),

      report,
    };
  };

export const generateCodeReview =
  async (request) => {
    const { content } =
      await generateAIReport(
        request
      );

    return content;
  };

export const streamChatCompletion =
  async ({ message }) =>
    groq.chat.completions.create({
      model:
        process.env.GROQ_MODEL ||
        "llama-3.3-70b-versatile",

      temperature: 0.3,

      stream: true,

      messages: [
        {
          role: "system",
          content:
            "You are CodeMind.AI assistant helping with debugging, DSA, optimization, architecture and interview preparation.",
        },

        {
          role: "user",
          content: message,
        },
      ],
    });