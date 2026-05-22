import { Sparkles } from "lucide-react";

function Brand({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_18px_48px_rgba(124,58,237,0.28)]">
        <Sparkles size={22} />
      </div>

      {!compact && (
        <div className="min-w-0">
          <h1 className="truncate text-xl font-black tracking-tight text-white">
            CodeMind<span className="text-violet-300">.AI</span>
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            AI Engine
          </p>
        </div>
      )}
    </div>
  );
}

export default Brand;
