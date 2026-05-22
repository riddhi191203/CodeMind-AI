import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import MainLayout from "../layouts/MainLayout";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentMessage,
      },
    ]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("codemind-token")}`,
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "",
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        aiResponse += decoder.decode(value);

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = aiResponse;
          return updated;
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[calc(100vh-116px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101218]/95 shadow-2xl shadow-black/30"
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">
              Module 05
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
              AI Chat Assistant
            </h1>
          </div>

          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 sm:flex">
            <Sparkles size={18} className="text-indigo-300" />
            <span className="text-sm font-medium text-slate-200">
              CodeMind AI
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#0d0f14] px-4 py-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 shadow-[0_0_40px_rgba(52,211,153,0.22)]">
                <Bot size={30} />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-white">
                Start a conversation
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Ask about debugging, DSA, optimization, architecture, or
                interview preparation.
              </p>
            </div>
          )}

          <div className="mx-auto max-w-4xl space-y-5">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      msg.role === "user"
                        ? "brand-gradient text-white"
                        : "bg-white/[0.07] text-slate-300"
                    }`}
                  >
                    {msg.role === "user" ? <User size={17} /> : <Bot size={17} />}
                  </div>

                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm leading-6 shadow-lg ${
                      msg.role === "user"
                        ? "border-violet-400/30 brand-gradient text-white"
                        : "border-white/10 bg-white/[0.06] text-slate-200"
                    }`}
                  >
                    <div
                      className={`prose max-w-none ${
                        msg.role === "user" ? "prose-slate" : "prose-invert"
                      }`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="mx-auto mt-5 flex max-w-4xl items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07] text-slate-300">
                <Bot size={17} />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <div className="flex gap-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 delay-100" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/10 bg-[#101218] p-4">
          <div className="mx-auto flex max-w-4xl gap-3">
            <input
              type="text"
              placeholder="Ask anything about programming..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-violet-400/50"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={loading}
              className="brand-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-violet-950/30 transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </motion.section>
    </MainLayout>
  );
}

export default Chat;
