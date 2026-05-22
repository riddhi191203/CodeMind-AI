import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import { Bug, Download, Gauge, Play, Terminal, Send, WandSparkles } from "lucide-react";

import api from "../api/api";
import MainLayout from "../layouts/MainLayout";
import ReviewOutput from "../components/ReviewOutput";

const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "C", "Go", "Rust", "PHP"];

const samples = {
  error: `def divide(a, b):\n    return a / b\n\nprint(divide(10, 0))`,
  refactor: `function calc(a,b,c){\n  var r=0;\n  if(c=='add'){r=a+b;}\n  else if(c=='sub'){r=a-b;}\n  else if(c=='mul'){r=a*b;}\n  else if(c=='div'){r=a/b;}\n  return r;\n}`,
  complexity: `function hasDuplicates(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = i + 1; j < arr.length; j++) {\n      if (arr[i] === arr[j]) return true;\n    }\n  }\n  return false;\n}`,
  editor: `// Welcome to CodeMind editor\nconst greet = (name) => \`Hello, \${name}!\`;\nconsole.log(greet("world"));`,
};

const normalizeLanguage = (language) => language.toLowerCase().replace("c++", "cpp");

const extractFirstCodeBlock = (markdown = "") => {
  const match = markdown.match(/```[\w+-]*\n([\s\S]*?)```/);
  return match?.[1]?.trim() || "";
};

function PageTitle({ eyebrow, title, subtitle, action, icon: Icon, onAction, loading }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-white">{title}</h1>
        <p className="mt-2 text-lg text-slate-400">{subtitle}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          disabled={loading}
          className="brand-gradient inline-flex items-center justify-center gap-3 rounded-xl px-5 py-3 font-bold text-white shadow-lg shadow-violet-950/30 disabled:opacity-60"
        >
          <Icon size={18} />
          {loading ? "Working..." : action}
        </button>
      )}
    </div>
  );
}

function LanguageSelect({ value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-200">Language</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0e20] px-4 text-slate-100 outline-none focus:border-violet-400/60"
      >
        {languages.map((language) => (
          <option key={language} className="bg-slate-950">{language}</option>
        ))}
      </select>
    </label>
  );
}

function ToolCard({ children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111631]/80 p-6 shadow-2xl shadow-black/20">
      {children}
    </section>
  );
}

function OutputPanel({ emptyIcon: Icon, emptyTitle, emptyText, loading, output }) {
  return (
    <ToolCard>
      <div className="min-h-[520px] overflow-auto">
        {loading ? (
          <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-violet-400" />
            <p className="mt-5 text-slate-400">CodeMind is generating your report...</p>
          </div>
        ) : output ? (
          <ReviewOutput review={output} />
        ) : (
          <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-500/20 text-violet-300">
              <Icon size={32} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white">{emptyTitle}</h2>
            <p className="mt-3 max-w-md text-slate-400">{emptyText}</p>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

function ErrorSolver() {
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState(samples.error);
  const [errorMessage, setErrorMessage] = useState("ZeroDivisionError: division by zero");
  const [stackTrace, setStackTrace] = useState('File "main.py", line 2, in divide\n  return a / b\nZeroDivisionError: division by zero');
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const solve = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/review/error-solver", {
        language: normalizeLanguage(language),
        code,
        errorMessage,
        stackTrace,
      });
      setOutput(data.review);
      toast.success("Error diagnosis generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to solve error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageTitle eyebrow="Module 02" title="AI Error Solver" subtitle="Cause, fix, corrected code and prevention tips." action="Solve error" icon={Bug} onAction={solve} loading={loading} />
      <div className="grid gap-7 xl:grid-cols-[0.95fr_1.05fr]">
        <ToolCard>
          <LanguageSelect value={language} onChange={setLanguage} />
          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-bold text-slate-200">Error message</span>
            <textarea rows={3} value={errorMessage} onChange={(event) => setErrorMessage(event.target.value)} className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0e20] px-4 py-3 font-mono text-sm text-slate-100 outline-none focus:border-violet-400/60" />
          </label>
          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-bold text-slate-200">Stack trace</span>
            <textarea rows={5} value={stackTrace} onChange={(event) => setStackTrace(event.target.value)} className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0e20] px-4 py-3 font-mono text-sm text-slate-100 outline-none focus:border-violet-400/60" />
          </label>
          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-bold text-slate-200">Source code</span>
            <textarea rows={8} value={code} onChange={(event) => setCode(event.target.value)} className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0e20] px-4 py-3 font-mono text-sm text-slate-100 outline-none focus:border-violet-400/60" />
          </label>
        </ToolCard>
        <OutputPanel emptyIcon={Bug} emptyTitle="Submit an error to see the diagnosis here." emptyText="CodeMind will explain the root cause, patch the code, and add prevention tips." loading={loading} output={output} />
      </div>
    </MainLayout>
  );
}

function Refactor() {
  const [language, setLanguage] = useState("JavaScript");
  const [beforeCode, setBeforeCode] = useState(samples.refactor);
  const [afterCode, setAfterCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(94);

  const refactor = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/review/refactor", {
        language: normalizeLanguage(language),
        code: beforeCode,
        problemStatement: "Clean naming, modularize code, reduce redundancy, and improve readability.",
      });
      setOutput(data.review);
      setScore(data.report?.qualityScore || 94);
      setAfterCode(data.report?.refactoredCode || extractFirstCodeBlock(data.review) || "// Refactored code will appear here.");
      toast.success("Refactor generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to refactor code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageTitle eyebrow="Module 03" title="AI Refactoring Engine" subtitle="Clean code conversion, better naming, modularization." action="Refactor now" icon={WandSparkles} onAction={refactor} loading={loading} />
      <ToolCard>
        <div className="grid gap-4 md:grid-cols-[220px_repeat(3,1fr)]">
          <LanguageSelect value={language} onChange={setLanguage} />
          {["Clean naming", "Modularize", "Remove redundancy"].map((item) => (
            <div key={item} className="flex h-20 items-center justify-between rounded-2xl border border-white/10 bg-[#0b0e20] px-4 text-slate-100">
              {item}
              <span className="h-7 w-12 rounded-full bg-indigo-500 p-1"><span className="block h-5 w-5 translate-x-5 rounded-full bg-[#0b0e20]" /></span>
            </div>
          ))}
        </div>
      </ToolCard>
      <div className="mt-7 grid items-center gap-6 xl:grid-cols-[1fr_auto_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between"><p className="font-bold uppercase tracking-[0.22em] text-slate-400">Before</p><span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300">Score 54</span></div>
          <textarea value={beforeCode} onChange={(event) => setBeforeCode(event.target.value)} rows={16} className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b0e20] p-4 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-violet-400/60" />
        </div>
        <button type="button" onClick={refactor} disabled={loading} className="brand-gradient mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white shadow-xl shadow-violet-950/40 disabled:opacity-60"><Send size={24} /></button>
        <div>
          <div className="mb-3 flex items-center justify-between"><p className="font-bold uppercase tracking-[0.22em] text-indigo-400">After</p><span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">Score {score}</span></div>
          <textarea value={afterCode || "// Click Refactor now to generate cleaner code."} readOnly rows={16} className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b0e20] p-4 font-mono text-sm leading-6 text-slate-100 outline-none" />
        </div>
      </div>
      {output && <div className="mt-7"><ToolCard><ReviewOutput review={output} /></ToolCard></div>}
    </MainLayout>
  );
}

function Complexity() {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(samples.complexity);
  const [output, setOutput] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/review/complexity", {
        language: normalizeLanguage(language),
        code,
      });
      setOutput(data.review);
      setReport(data.report);
      toast.success("Complexity report generated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to analyze complexity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageTitle eyebrow="Module 04" title="Complexity Analyzer" subtitle="Time / space complexity, inefficient loops, recursion tips." action="Analyze" icon={Gauge} onAction={analyze} loading={loading} />
      <div className="grid gap-7 xl:grid-cols-[1fr_0.95fr]">
        <ToolCard>
          <LanguageSelect value={language} onChange={setLanguage} />
          <textarea value={code} onChange={(event) => setCode(event.target.value)} rows={18} className="mt-6 w-full resize-none rounded-2xl border border-white/10 bg-[#0b0e20] p-4 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-violet-400/60" />
        </ToolCard>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {[["Time", report?.complexity?.time || "Run analyzer", "text-amber-300"], ["Space", report?.complexity?.space || "Run analyzer", "text-emerald-300"]].map(([title, value, color]) => (
              <ToolCard key={title}><p className="uppercase tracking-widest text-slate-400">{title}</p><div className="mt-10 h-1 w-12 bg-violet-400" /><p className={`mt-6 font-semibold ${color}`}>{value}</p></ToolCard>
            ))}
          </div>
          <ToolCard>
            <h2 className="flex items-center gap-3 text-xl font-bold text-white"><Gauge size={22} className="text-indigo-400" />Growth chart</h2>
            <div className="mt-6 h-44 rounded-2xl bg-[#0b0e20] p-5"><svg viewBox="0 0 420 150" className="h-full w-full"><path d="M20 120 C150 110 240 70 390 22" fill="none" stroke="#f43f5e" strokeWidth="4" /><path d="M20 120 L390 30" fill="none" stroke="#f8b400" strokeWidth="3" /><path d="M20 120 C160 122 260 110 390 98" fill="none" stroke="#10b981" strokeWidth="3" /></svg></div>
          </ToolCard>
          <ToolCard>{loading ? <p className="text-slate-400">Analyzing...</p> : output ? <ReviewOutput review={output} /> : <p className="text-slate-400">Run analysis to see inefficient loops and recursion tips.</p>}</ToolCard>
        </div>
      </div>
    </MainLayout>
  );
}

function CodeEditor() {

  const [language, setLanguage] =
    useState("javascript");

  const [theme, setTheme] =
    useState("vs-dark");

  const [code, setCode] =
    useState(`console.log("Hello CodeMind");`);

  const [output, setOutput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const lineCount = useMemo(
    () =>
      code.split("\n").length,
    [code]
  );

  const runCode = async () => {

    try {

      setLoading(true);

      setOutput("");

      const { data } =
        await api.post(
          "/api/editor/run",
          {
            language,
            code,
          }
        );

      setOutput(
        data.output ||
          "No output"
      );

      toast.success(
        "Code executed"
      );

    } catch (error) {

      console.log(error);

      setOutput(
        "Execution failed"
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to execute code"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <MainLayout>

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <p className="text-sm font-bold uppercase tracking-[0.22em] text-violet-400">
            Workspace
          </p>

          <h1 className="mt-2 text-4xl font-black text-white">
            AI Code Editor
          </h1>

          <p className="mt-3 text-lg text-slate-400">
            Write, edit and execute code in real-time.
          </p>

        </div>

        <button
          onClick={runCode}
          disabled={loading}
          className="brand-gradient inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-bold text-white disabled:opacity-60"
        >

          <Play size={18} />

          {loading
            ? "Running..."
            : "Run Code"}

        </button>

      </div>

      {/* MAIN GRID */}

      <div className="grid gap-7 xl:grid-cols-[1.2fr_0.8fr]">

        {/* LEFT PANEL */}

        <div className="rounded-3xl border border-white/10 bg-[#111631]/80 p-6 shadow-2xl shadow-black/20">

          {/* TOP BAR */}

          <div className="mb-5 flex items-center justify-between gap-4">

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  normalizeLanguage(
                    e.target.value
                  )
                )
              }
              className="h-11 rounded-xl border border-white/10 bg-[#0b0e20] px-4 text-white outline-none"
            >

              {languages.map(
                (lang) => (
                  <option
                    key={lang}
                    value={normalizeLanguage(
                      lang
                    )}
                  >
                    {lang}
                  </option>
                )
              )}

            </select>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setTheme(
                    theme ===
                      "vs-dark"
                      ? "light"
                      : "vs-dark"
                  )
                }
                className="rounded-xl border border-white/10 bg-[#0b0e20] px-4 py-2 text-white"
              >
                {theme ===
                "vs-dark"
                  ? "Dark"
                  : "Light"}
              </button>

              <span className="rounded-xl bg-[#0b0e20] px-4 py-2 text-slate-400">
                {lineCount} lines
              </span>

            </div>

          </div>

          {/* MONACO EDITOR */}

          <div className="h-[700px] overflow-hidden rounded-2xl border border-white/10">

            <Editor
              height="100%"
              language={language}
              theme={theme}
              value={code}
              onChange={(value) =>
                setCode(
                  value || ""
                )
              }
              options={{
                fontSize: 14,

                minimap: {
                  enabled: false,
                },

                wordWrap: "on",

                scrollBeyondLastLine: false,

                automaticLayout: true,

                padding: {
                  top: 16,
                },
              }}
            />

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="rounded-3xl border border-white/10 bg-[#111631]/80 p-6 shadow-2xl shadow-black/20">

          <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">

            <Terminal className="text-emerald-400" />

            <h2 className="text-xl font-bold text-white">
              Console Output
            </h2>

          </div>

          <div className="h-[700px] overflow-auto rounded-2xl bg-black p-5 font-mono text-sm text-emerald-300">

            {loading ? (

              <div className="flex h-full items-center justify-center">

                Running code...

              </div>

            ) : (

              <pre className="whitespace-pre-wrap">
                {output ||
                  "Run code to see output"}
              </pre>

            )}

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export { CodeEditor, Complexity, ErrorSolver, Refactor };