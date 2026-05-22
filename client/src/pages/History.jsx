import { useEffect, useMemo, useState } from "react";
import { Download, GitCompare, Search, Sparkles, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "../api/api";
import MainLayout from "../layouts/MainLayout";

function History() {
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (search = "") => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/review/history", {
        params: search ? { search } : {},
      });
      setReviews(data.reviews || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadReports = async () => {
      try {
        const { data } = await api.get("/api/review/history");
        setReviews(data.reviews || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) =>
        `${review.language} ${review.mode} ${review.problemStatement}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, reviews]
  );

  const toggleSelected = (id) => {
    setSelected((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id].slice(-2)
    );
  };

  const downloadReport = async (id) => {
    try {
      const { data } = await api.get(`/api/review/${id}/download`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `codemind-report-${id}.md`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  const deleteReport = async (id) => {
    try {
      await api.delete(`/api/review/${id}`);
      setReviews((items) => items.filter((item) => item._id !== id));
      setSelected((items) => items.filter((item) => item !== id));
      toast.success("Report deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const compareReports = async () => {
    if (selected.length !== 2) {
      toast.error("Select exactly two reports to compare");
      return;
    }

    try {
      const { data } = await api.post("/api/review/compare", {
        baseId: selected[0],
        targetId: selected[1],
      });
      setComparison(data.comparison);
      toast.success("Reports compared");
    } catch (error) {
      toast.error(error.response?.data?.message || "Compare failed");
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">
            Workspace
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
            Saved Reports
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            View previous reviews, compare versions, export and delete reports.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex h-12 w-full items-center gap-3 rounded-xl border border-white/10 bg-[#0b0e20] px-4 sm:w-96">
            <Search size={18} className="text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") fetchReviews(query);
              }}
              placeholder="Search history"
              className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
            />
          </div>
          <button
            type="button"
            onClick={compareReports}
            className="brand-gradient inline-flex h-12 items-center gap-2 rounded-xl px-4 font-bold text-white"
          >
            <GitCompare size={17} />
            Compare
          </button>
        </div>
      </div>

      {comparison && (
        <div className="mt-6 rounded-3xl border border-indigo-400/30 bg-indigo-400/10 p-5 text-slate-200">
          <p className="font-bold text-white">Comparison ready</p>
          <p className="mt-2 text-sm">
            Score delta: {comparison.scoreDelta}. Code changed:{" "}
            {comparison.codeChanged ? "Yes" : "No"}.
          </p>
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-56 animate-pulse rounded-3xl bg-white/[0.06]" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#111631]/80 p-12 text-center">
          <Sparkles className="mx-auto text-slate-600" size={40} />
          <h2 className="mt-5 text-2xl font-black text-white">No reports found</h2>
          <p className="mt-2 text-slate-500">Run a review to build your report history.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {filteredReviews.map((review, index) => {
            const isSelected = selected.includes(review._id);

            return (
              <motion.article
                key={review._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`overflow-hidden rounded-3xl border bg-[#111631]/80 shadow-2xl shadow-black/20 ${
                  isSelected ? "border-indigo-400" : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                  <button
                    type="button"
                    onClick={() => toggleSelected(review._id)}
                    className="text-left"
                  >
                    <h2 className="text-lg font-black capitalize text-white">
                      {review.language || "Unknown"} {review.mode || "review"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => downloadReport(review._id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/[0.06]"
                      aria-label="Download report"
                    >
                      <Download size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSelected(review._id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/[0.06]"
                      aria-label="Select for compare"
                    >
                      <GitCompare size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReport(review._id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-rose-300 hover:bg-rose-500/10"
                      aria-label="Delete report"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <p className="line-clamp-2 text-sm leading-6 text-slate-400">
                    {review.problemStatement || "CodeMind analysis report"}
                  </p>
                  <pre className="mt-4 max-h-40 overflow-auto rounded-2xl border border-white/10 bg-[#0b0e20] p-4 text-xs leading-6 text-slate-300">
                    {review.code}
                  </pre>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}

export default History;
