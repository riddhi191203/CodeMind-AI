import Review from "../models/Review.js";
import { generateAIReport, SUPPORTED_LANGUAGES } from "../services/geminiService.js";

const getUploadedCode = (req) => req.file?.buffer?.toString("utf-8");

const normalizeLanguage = (language = "javascript") => {
  const normalized = language.toLowerCase().replace("c++", "cpp");
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : "javascript";
};

const createReport = async (req, res, mode) => {
  try {
    const code = getUploadedCode(req) || req.body.code || "";
    const language = normalizeLanguage(req.body.language);

    if (!code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const problemStatement =
      req.body.problemStatement || req.body.prompt || "Analyze this code";

    const { content, report } = await generateAIReport({
      mode,
      code,
      language,
      problemStatement,
      errorMessage: req.body.errorMessage,
      stackTrace: req.body.stackTrace,
      options: req.body.options || {},
    });

    const savedReview = await Review.create({
      user: req.user.id,
      title: `${mode} - ${language}`,
      language,
      mode,
      problemStatement,
      errorMessage: req.body.errorMessage,
      stackTrace: req.body.stackTrace,
      code,
      review: content,
      report,
    });

    res.status(200).json({
      success: true,
      message: "AI report generated successfully",
      review: content,
      report,
      reviewId: savedReview._id,
      data: savedReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewCode = (req, res) =>
  createReport(req, res, req.body.mode || "review");

export const solveError = (req, res) => createReport(req, res, "error");

export const refactorCode = (req, res) => createReport(req, res, "refactor");

export const analyzeComplexity = (req, res) =>
  createReport(req, res, "complexity");

export const formatCode = (req, res) => createReport(req, res, "format");

export const getSupportedLanguages = (req, res) => {
  res.status(200).json({
    success: true,
    languages: SUPPORTED_LANGUAGES,
  });
};

export const getReviewHistory = async (req, res) => {
  try {
    const { search, language, mode } = req.query;
    const filter = { user: req.user.id };

    if (language) filter.language = normalizeLanguage(language);
    if (mode) filter.mode = mode;
    if (search) {
      filter.$or = [
        { language: new RegExp(search, "i") },
        { mode: new RegExp(search, "i") },
        { problemStatement: new RegExp(search, "i") },
        { review: new RegExp(search, "i") },
      ];
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const downloadReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const file = `# CodeMind Report\n\nLanguage: ${review.language}\nMode: ${review.mode}\nCreated: ${review.createdAt.toISOString()}\n\n## Problem\n${review.problemStatement || "Not provided"}\n\n## Source Code\n\`\`\`${review.language}\n${review.code}\n\`\`\`\n\n## AI Report\n${review.review}\n`;

    res.setHeader("Content-Type", "text/markdown");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="codemind-report-${review._id}.md"`
    );
    res.send(file);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const compareReviews = async (req, res) => {
  try {
    const { baseId, targetId } = req.body;

    const reviews = await Review.find({
      _id: { $in: [baseId, targetId] },
      user: req.user.id,
    });

    if (reviews.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "Both reports are required for comparison",
      });
    }

    const [base, target] = [baseId, targetId].map((id) =>
      reviews.find((review) => review._id.toString() === id)
    );

    res.status(200).json({
      success: true,
      comparison: {
        base: {
          id: base._id,
          language: base.language,
          mode: base.mode,
          qualityScore: base.report?.qualityScore || null,
          createdAt: base.createdAt,
        },
        target: {
          id: target._id,
          language: target.language,
          mode: target.mode,
          qualityScore: target.report?.qualityScore || null,
          createdAt: target.createdAt,
        },
        scoreDelta:
          (target.report?.qualityScore || 0) - (base.report?.qualityScore || 0),
        codeChanged: base.code !== target.code,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
