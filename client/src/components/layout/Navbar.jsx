import { Bell, Menu } from "lucide-react";
import toast from "react-hot-toast";

function Navbar({
  onOpenSidebar,
  onToggleSidebar,
}) {
  return (
    <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-white/10 bg-[#090b1d]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-7">

      {/* Left */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white lg:flex"
        >
          <Menu size={20} />
        </button>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-white">
            CodeMind AI
          </h1>

          <p className="text-sm text-slate-500">
            AI Engineering Workspace
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <Bell size={18} />

          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-violet-400" />
        </button>

        <button
          type="button"
          onClick={() =>
            toast.success(
              "You are already using CodeMind Pro"
            )
          }
          className="brand-gradient rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-950/30"
        >
          Upgrade
        </button>

      </div>

    </header>
  );
}

export default Navbar;