import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bug,
  Code2,
  Gauge,
  LayoutGrid,
  MessageSquare,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

const stats = [
  ["Reviews this month", "128", "+24%"],
  ["Avg quality score", "87", "+6"],
  ["Errors solved", "342", "+18%"],
  ["Lines refactored", "12.4k", "+9%"],
];

const tools = [
  ["/reviewer", "AI Code Review", "Score, suggestions, security and best practices.", Code2, "bg-violet-500"],
  ["/error-solver", "Error Solver", "Explain stack traces and ship the fix.", Bug, "bg-orange-500"],
  ["/refactor", "Refactor", "Cleaner names, less redundancy, modular code.", WandSparkles, "bg-indigo-500"],
  ["/complexity", "Complexity", "Time and space analysis with growth hints.", Gauge, "bg-cyan-500"],
  ["/chat", "AI Chat", "Debugging, DSA, architecture and interviews.", MessageSquare, "bg-violet-500"],
  ["/history", "Saved Reports", "Search, compare, download and delete runs.", LayoutGrid, "bg-rose-500"],
];

function Dashboard() {
  return (
    <MainLayout>
      <section className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-300">
          <Sparkles size={16} />
          Welcome back, Aarav
        </div>

        <h1 className="mt-6 text-5xl font-black tracking-tight text-white">
          Your engineering cockpit.
        </h1>
        <p className="mt-3 text-xl text-slate-400">
          Review, debug and refactor - all in one workspace.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, change], index) => (
            <motion.article
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/10 bg-[#111631]/80 p-6 shadow-2xl shadow-black/20"
            >
              <p className="min-h-10 text-sm uppercase tracking-widest text-slate-400">
                {label}
              </p>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-4xl font-black text-white">{value}</p>
                <span className="flex items-center gap-1 text-sm font-bold text-emerald-300">
                  <ArrowUpRight size={15} />
                  {change}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black text-white">Jump into a tool</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map(([path, title, description, Icon, color], index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={path}
                className="group block min-h-52 rounded-3xl border border-white/10 bg-[#111631]/75 p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-indigo-400/40"
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} text-white`}>
                    <Icon size={25} />
                  </span>
                  <ArrowUpRight className="text-slate-500 transition group-hover:text-white" />
                </div>
                <h3 className="mt-7 text-xl font-black text-white">{title}</h3>
                <p className="mt-3 max-w-xs text-lg leading-7 text-slate-400">
                  {description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export default Dashboard;
