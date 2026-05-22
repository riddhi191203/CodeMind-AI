import { Link } from "react-router-dom";
import { ArrowRight, Languages, Sparkles, Zap } from "lucide-react";

import Brand from "../components/ui/Brand";
import CodeBlock from "../components/ui/CodeBlock";

const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "C", "Go", "Rust", "PHP"];

function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050716] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,106,252,0.28),transparent_32%),linear-gradient(135deg,#111a43,#160d32_48%,#050716)]" />

      <header className="relative z-10 border-b border-white/5 bg-[#090b1d]/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Brand />
          <nav className="hidden items-center gap-10 text-sm font-medium text-slate-400 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#languages" className="hover:text-white">Languages</a>
    
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden font-bold text-white sm:block">
              Sign in
            </Link>
            <Link
              to="/register"
              className="brand-gradient inline-flex items-center gap-3 rounded-xl px-5 py-3 font-bold text-white"
            >
              Launch app
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-10 lg:grid-cols-[1fr_0.78fr] lg:py-16">
          <div className="text-center lg:text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm font-bold text-indigo-300 lg:mx-0">
              <Zap size={16} />
              New - Complexity Analyzer 2.0
            </div>
            <h1 className="mt-8 text-5xl font-black leading-[1.04] tracking-tight sm:text-7xl">
              The AI engineer that{" "}
              <span className="text-[#7568ff]">reads, fixes and refactors</span>{" "}
              your code.
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-xl leading-8 text-slate-400 lg:mx-0">
              CodeMind reviews source code, explains errors, rewrites messy
              functions and answers your hardest DSA questions across nine
              languages.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                to="/register"
                className="brand-gradient inline-flex items-center gap-3 rounded-xl px-8 py-4 text-lg font-bold shadow-xl shadow-violet-950/40"
              >
                Start reviewing free
                <ArrowRight size={20} />
              </Link>
              
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d1022]/80 p-4 shadow-2xl shadow-black/40">
            <CodeBlock
              code={`function getUsers(users) {\n  return users.filter((user) => user.active === true);\n}\n\n// CodeMind checks quality, security,\n// complexity and refactor options.`}
              minHeight="min-h-[330px]"
            />
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 pb-20">
          <div className="grid gap-4 md:grid-cols-3">
            {["AI Code Review", "AI Error Solver", "AI Refactoring Engine"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6">
                <Sparkles className="text-indigo-300" />
                <h2 className="mt-5 text-2xl font-black">{item}</h2>
                <p className="mt-3 text-slate-400">
                  Production-focused analysis with clear suggestions and clean
                  output.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="languages" className="mx-auto max-w-7xl px-5 pb-20">
          <div className="flex items-center gap-3">
            <Languages className="text-indigo-300" />
            <h2 className="text-2xl font-black">Multi-language support</h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {languages.map((language) => (
              <span key={language} className="rounded-full border border-white/10 bg-[#0d1022] px-4 py-2 text-sm font-bold text-slate-200">
                {language}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
