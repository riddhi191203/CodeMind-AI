import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import {
  Copy,
  Check,
} from "lucide-react";

import { useState } from "react";

function ReviewOutput({ review }) {
  const [copied, setCopied] =
    useState(false);

  // Copy Full Review
  const copyReview = async () => {
    try {
      await navigator.clipboard.writeText(
        review
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

 return (
  <div className="relative w-full">

    {/* Copy Button */}
    <button
      type="button"
      onClick={copyReview}
      className="absolute right-0 top-0 z-10 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f172a] px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-[#162033]"
    >
      {copied ? (
        <>
          <Check size={16} />
          Copied
        </>
      ) : (
        <>
          <Copy size={16} />
          Copy
        </>
      )}
    </button>

    {/* Markdown */}
    <div className="max-w-none overflow-hidden pt-14">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 border-b border-white/10 pb-4 text-4xl font-black text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mt-10 mb-4 text-2xl font-bold text-violet-300">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mt-7 mb-3 text-xl font-semibold text-white">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="mb-5 text-[15px] leading-8 text-slate-300">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="mb-6 space-y-3">
              {children}
            </ul>
          ),

          li: ({ children }) => (
            <li className="flex gap-3 text-slate-300">
              <span className="mt-2 h-2 w-2 rounded-full bg-violet-400"></span>

              <span className="leading-7">
                {children}
              </span>
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-5 py-4 text-slate-300 italic">
              {children}
            </blockquote>
          ),

          code({
            inline,
            className,
            children,
            ...props
          }) {
            const match =
              /language-(\w+)/.exec(
                className || ""
              );

            return !inline && match ? (
              <div className="my-7 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1120]">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-[#111827] px-5 py-3">

                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {match[1]}
                  </span>

                </div>

                {/* Code */}
                <div className="overflow-x-auto">

                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      padding: "24px",
                      background: "#0b1120",
                      fontSize: "14px",
                      lineHeight: "1.8",
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>

                </div>

              </div>
            ) : (
              <code className="rounded-md bg-white/[0.08] px-2 py-1 text-sm text-violet-300">
                {children}
              </code>
            );
          },
        }}
      >
        {review}
      </ReactMarkdown>

    </div>

  </div>
);
}

export default ReviewOutput;