function CodeBlock({ code, minHeight = "min-h-[300px]" }) {
  const lines = code.trimEnd().split("\n");

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0d1022] ${minHeight}`}>
      <div className="border-b border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-500">
        source.js
      </div>
      <pre className="overflow-auto p-0 text-[13px] leading-6">
        {lines.map((line, index) => (
          <div key={`${line}-${index}`} className="grid grid-cols-[58px_1fr]">
            <span className="select-none border-r border-white/10 bg-white/[0.025] px-4 text-right text-slate-500">
              {index + 1}
            </span>
            <code className="px-4 font-mono text-slate-100">{line || " "}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}

export default CodeBlock;
