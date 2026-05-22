import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast";
import {
  Activity,
  Brain,
  Bug,
  Code2,
  Download,
  FileText,
  Gauge,
  Sparkles,
  Upload,
} from "lucide-react";

import api from "../api/api";
import MainLayout from "../layouts/MainLayout";
import ReviewOutput from "../components/ReviewOutput";

const languages = [
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

const analysisModes = [
  {
    value: "review",
    label: "Review",
    icon: FileText,
  },
  {
    value: "fix",
    label: "Bug Fix",
    icon: Bug,
  },
  {
    value: "explain",
    label: "Explain",
    icon: Brain,
  },
  {
    value: "optimize",
    label: "Optimize",
    icon: Gauge,
  },
];

const defaultProblem =
  "Analyze correctness, maintainability, performance, security, and complexity.";

function ModeButton({ mode, selected, onClick }) {
  const Icon = mode.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition ${
        selected
          ? "border-violet-400 brand-gradient text-white shadow-lg shadow-violet-950/30"
          : "border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={16} />
      {mode.label}
    </button>
  );
}

function Reviewer() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [mode, setMode] = useState("review");
  const [file, setFile] = useState(null);
  const [problemStatement, setProblemStatement] = useState(defaultProblem);

  const selectedMode = useMemo(
    () => analysisModes.find((item) => item.value === mode),
    [mode]
  );

  const actionLabel =
    selectedMode?.label === "Review"
      ? "Review Code"
      : `${selectedMode?.label} Code`;

  const analyzeCode = async () => {
    if (!code.trim() && !file) {
      toast.error("Add code or upload a file first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("language", language);
      formData.append("mode", mode);
      formData.append("problemStatement", problemStatement);
      formData.append("code", code);

      if (file) formData.append("file", file);

      const { data } = await api.post("/api/review/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReview(data.review);
      toast.success("AI review generated");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

const exportPdf = async () => {
  try {
    if (!review) {
      toast.error(
        "Generate review first"
      );
      return;
    }

    toast.loading(
      "Generating PDF...",
      {
        id: "pdf",
      }
    );

    // Create clean printable content
    const container =
      document.createElement(
        "div"
      );

    container.style.padding =
      "40px";

    container.style.width =
      "900px";

    container.style.background =
      "#ffffff";

    container.style.color =
      "#000000";

    container.style.fontFamily =
      "Arial, sans-serif";

    container.style.lineHeight =
      "1.7";

    container.innerHTML = `
      <h1 style="
        font-size:32px;
        margin-bottom:20px;
      ">
        CodeMind AI Report
      </h1>

      <pre style="
        white-space:pre-wrap;
        word-wrap:break-word;
        font-size:14px;
      ">
${review
  .replace(/#/g, "")
  .replace(/```/g, "")}
      </pre>
    `;

    document.body.appendChild(
      container
    );

    await html2pdf()
      .from(container)
      .set({
        margin: 10,

        filename:
          "CodeMind-Report.pdf",

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 2,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation:
            "portrait",
        },
      })
      .save();

    document.body.removeChild(
      container
    );

    toast.success(
      "PDF exported",
      {
        id: "pdf",
      }
    );
  } catch (error) {
    console.log(error);

    toast.error(
      "Export failed",
      {
        id: "pdf",
      }
    );
  }
};

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);

    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => setCode(target.result);
    reader.readAsText(uploadedFile);
  };

  return (
    <MainLayout>
      <div className="grid min-h-[calc(100vh-116px)] gap-5 xl:grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)]">
        <motion.section
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101218]/95 shadow-2xl shadow-black/30"
        >
          <div className="border-b border-white/10 p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">
                  Module 01
                </p>
                <p className="mt-3 text-sm font-medium text-indigo-300">
                  AI Reviewer
                </p>
                <h1 className="mt-1 text-4xl font-black tracking-tight text-white">
                  AI Code Review
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Quality score, security risks, optimizations and best practices.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportPdf}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10"
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  type="button"
                  onClick={analyzeCode}
                  disabled={loading}
                  className="brand-gradient inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <Activity size={17} className="animate-pulse" />
                  ) : (
                    <Sparkles size={17} />
                  )}
                  {loading ? "Analyzing" : actionLabel}
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[160px_1fr]">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-sm font-medium text-slate-200 outline-none transition focus:border-violet-400/50"
              >
                {languages.map((item) => (
                  <option key={item} value={item} className="bg-slate-950">
                    {item.toUpperCase()}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {analysisModes.map((item) => (
                  <ModeButton
                    key={item.value}
                    mode={item}
                    selected={mode === item.value}
                    onClick={() => setMode(item.value)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_220px]">
              <textarea
                value={problemStatement}
                onChange={(event) => setProblemStatement(event.target.value)}
                rows={2}
                className="resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-violet-400/50"
              />

              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">
                <Upload size={17} />
                <span className="max-w-36 truncate">
                  {file?.name || "Upload file"}
                </span>
                <input
                  type="file"
                    accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rs,.php"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          <div className="min-h-[460px] flex-1">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 14,
                minimap: {
                  enabled: false,
                },
                padding: {
                  top: 16,
                },
                scrollBeyondLastLine: false,
                wordWrap: "on",
              }}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101218]/95 shadow-2xl shadow-black/30"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.07] text-indigo-300">
                <Code2 size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  AI Analysis
                </h2>
                <p className="text-xs text-slate-500">
                  Structured markdown report
                </p>
              </div>
            </div>
          </div>

          <div
            id="pdf-content"
            className="min-h-[460px] flex-1 overflow-auto bg-[#0d0f14] p-5"
          >
            {loading ? (
              <div className="flex h-full flex-col items-center justify-center py-24 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-violet-400" />
                <p className="mt-5 text-sm text-slate-400">
                  AI is analyzing your code...
                </p>
              </div>
            ) : (
              <ReviewOutput
                review={
                  review ||
                  "Choose a mode, paste your code, and CodeMind AI will generate a focused review here."
                }
              />
            )}
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
}

export default Reviewer;
