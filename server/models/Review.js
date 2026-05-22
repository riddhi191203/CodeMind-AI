import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    language: String,

    mode: String,

    title: {
      type: String,
      default: "CodeMind Report",
    },

    problemStatement: String,

    errorMessage: String,

    stackTrace: String,

    code: String,

    review: String,

    report: {
      qualityScore: Number,
      suggestions: [String],
      optimizationOpportunities: [String],
      errorFixes: [String],
      bestPractices: [String],
      securityRisks: [String],
      complexity: {
        time: String,
        space: String,
        inefficientPatterns: [String],
        recursionTips: [String],
      },
      correctedCode: String,
      refactoredCode: String,
      summary: String,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model(
  "Review",
  reviewSchema
);

export default Review;
