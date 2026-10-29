"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Search,
  BookOpen,
  FlaskConical,
  MessageSquare,
  ShieldCheck,
  Download,
  Loader2,
  Trash2,
  Zap,
  Cpu,
  ChevronDown,
  X,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const PRESET_MODELS = [
  {
    id: "kc/kilo-auto/free",
    name: "Kilo Auto Free (Rekomendasi)",
    badge: "Gratis & Cepat",
    desc: "Model pintar otomatis, tanpa biaya token & responsif.",
  },
  {
    id: "auto/best-free",
    name: "Auto Best Free",
    badge: "Gratis",
    desc: "Failover otomatis ke model-model gratis terbaik di OmniRoute.",
  },
  {
    id: "auto/chat",
    name: "Auto Smart Chat",
    badge: "Seimbang",
    desc: "Router cerdas untuk kebutuhan percakapan & konsultasi bisnis.",
  },
  {
    id: "auto/fast",
    name: "Auto Fast Router",
    badge: "Super Cepat",
    desc: "Dioptimalkan untuk kecepatan pembuatan draf & teks singkat.",
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Google Gemini 2.5 Flash",
    badge: "Google AI",
    desc: "Membutuhkan provider Google AI Studio di dashboard OmniRoute.",
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3 Chat",
    badge: "DeepSeek",
    desc: "Membutuhkan provider DeepSeek di dashboard OmniRoute.",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "OpenAI GPT-4o Mini",
    badge: "OpenAI",
    desc: "Membutuhkan provider OpenAI di dashboard OmniRoute.",
  },
];

const QUICK_PROMPTS = [
  {
    icon: Search,
    label: "Generate SEO Maklon",
    prompt:
      "Tolong buatkan judul SEO, meta description, dan 10 kata kunci relevan untuk halaman 'Jasa Maklon Kapsul Herbal BPOM & Halal'.",
  },
  {
    icon: BookOpen,
    label: "Tulis Artikel Insight",
    prompt:
      "Tuliskan artikel edukasi menarik (sekitar 300 kata) tentang 'Panduan Lengkap Memulai Bisnis Minuman Serbuk Herbal dengan Izin BPOM'.",
  },
  {
    icon: FlaskConical,
    label: "Ide Formulasi & Khasiat",
    prompt:
      "Berikan rekomendasi formulasi bahan aktif alami untuk produk herbal daya tahan tubuh (imunitas) dalam bentuk sediaan kapsul yang aman regulasi BPOM.",
  },
  {
    icon: MessageSquare,
    label: "Draft Balasan Calon Klien",
    prompt:
      "Buatkan draft balasan WhatsApp yang hangat dan profesional untuk calon klien yang menanyakan estimasi biaya maklon herbal, MOQ, dan proses perizinan BPOM.",
  },
  {
    icon: ShieldCheck,
    label: "Alur Legalitas BPOM & Halal",
    prompt:
      "Jelaskan secara ringkas tahapan alur legalitas dari uji laboratorium, pendaftaran notifikasi BPOM, hingga terbit sertifikasi Halal untuk produk maklon herbal.",
  },
];

export default function AiAssistantPage() {
  const [selectedModel, setSelectedModel] = useState<string>("kc/kilo-auto/free");
  const [customModelInput, setCustomModelInput] = useState("");
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [availableOmniModels, setAvailableOmniModels] = useState<string[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `### Halo! Saya Asisten AI CV. Indo Green Nature 🌿

Saya siap membantu operasional website dan bisnis **Maklon Herbal** Anda:
* 🔍 **Riset & Buat SEO** (Meta Title, Description, Keywords)
* 📝 **Menulis Artikel Insight / Blog Edukasi**
* 🧪 **Rekomendasi Formulasi & Sediaan** (Kapsul, Serbuk, Teh, Madu)
* 💬 **Draft Balasan CS / WhatsApp Calon Klien**
* 📋 **Penyusunan Copywriting Produk & Regulasi BPOM / Halal**

*Anda dapat mengganti model AI kapan saja melalui tombol model di bagian atas!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ambil model tersimpan dari localStorage atau backend
  useEffect(() => {
    const saved = localStorage.getItem("indogreen_ai_model");
    if (saved) {
      setSelectedModel(saved);
    }

    // Fetch model default & list model dari OmniRoute
    fetch("/api/ai")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          if (!saved && data.defaultModel) {
            setSelectedModel(data.defaultModel);
          }
          if (Array.isArray(data.models)) {
            setAvailableOmniModels(data.models);
          }
        }
      })
      .catch((err) => console.warn("Fetch models error:", err));
  }, []);

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("indogreen_ai_model", modelId);
    setIsModelModalOpen(false);
    toast.success(`Model aktif diubah ke: ${modelId}`);
  };

  const handleApplyCustomModel = () => {
    if (!customModelInput.trim()) return;
    const modelId = customModelInput.trim();
    handleSelectModel(modelId);
    setCustomModelInput("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Teks berhasil disalin ke clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm("Bersihkan seluruh riwayat obrolan?")) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Riwayat obrolan telah dibersihkan. Ada yang bisa saya bantu selanjutnya?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleExportChat = () => {
    const textContent = messages
      .map((m) => `[${m.role.toUpperCase()}] (${m.timestamp}):\n${m.content}\n`)
      .join("\n---\n\n");
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IndoGreen-AI-Chat-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Riwayat chat berhasil diunduh!");
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const userText = customPrompt || input.trim();
    if (!userText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput("");
    setIsLoading(true);

    try {
      // Siapkan riwayat percakapan untuk konteks multi-turn
      const historyForApi = messages
        .filter((m) => m.id !== "welcome")
        .concat(userMessage)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "chat",
          model: selectedModel,
          messages: historyForApi,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mendapatkan respon AI");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.result,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses AI");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ **Kendala pada Model (${selectedModel}):**\n${err.message || "Gagal menghubungi model AI"}\n\n*Tips: Jika model ini error, Anda bisa mengganti model ke 'kc/kilo-auto/free' melalui tombol model di pojok kanan atas.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] max-w-6xl mx-auto px-4 py-4 md:py-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                AI Asisten Maklon Herbal
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Online
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              CV. Indo Green Nature • CPOTB, BPOM, dan Halal Resmi
            </p>
          </div>
        </div>

        {/* ACTIONS & MODEL SELECTOR */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* TOMBOL GANTI MODEL */}
          <button
            onClick={() => setIsModelModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/80 hover:border-emerald-500/50 text-xs font-medium text-foreground hover:bg-secondary/60 shadow-xs transition-all cursor-pointer group"
            title="Klik untuk mengganti model AI"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="max-w-[130px] sm:max-w-[160px] truncate">{selectedModel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportChat}
            className="text-xs h-8 gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
            title="Download riwayat obrolan sebagai file teks"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="text-xs h-8 gap-1.5 cursor-pointer text-muted-foreground hover:text-red-500 hover:border-red-500/30"
            title="Bersihkan obrolan"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* QUICK PROMPT BADGES */}
      <div className="py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> Cepat:
        </span>
        {QUICK_PROMPTS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 hover:bg-secondary text-secondary-foreground hover:text-emerald-600 dark:hover:text-emerald-400 border border-border/50 hover:border-emerald-500/40 transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* CHAT MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4 rounded-xl">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] md:max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    isUser
                      ? "bg-emerald-600 text-white rounded-br-xs"
                      : "bg-card border border-border/70 text-card-foreground rounded-bl-xs"
                  }`}
                >
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-md text-muted-foreground/60 hover:text-foreground bg-muted/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Salin teks respon ini"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>

                  <div
                    className={`mt-1.5 text-[10px] flex items-center gap-1 ${
                      isUser ? "text-emerald-100/70 justify-end" : "text-muted-foreground/60"
                    }`}
                  >
                    <span>{message.timestamp}</span>
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-card border border-border/70 rounded-2xl px-4 py-3 text-sm shadow-sm flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span className="text-xs">
                Meracik jawaban dengan model <span className="font-semibold text-foreground">{selectedModel}</span>...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="pt-2 border-t border-border/60">
        <div className="relative flex items-end gap-2 bg-card border border-border/70 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/15 rounded-2xl p-2 shadow-sm transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan sesuatu atau minta AI membuatkan SEO / artikel / formulasi maklon..."
            rows={2}
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground/60 text-foreground"
          />

          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-9 w-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shrink-0 cursor-pointer disabled:opacity-40"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[11px] text-center text-muted-foreground/60 mt-1.5">
          Model aktif: <span className="text-foreground font-medium">{selectedModel}</span> • Tekan{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">Enter</kbd> untuk kirim,{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">Shift + Enter</kbd> untuk baris
          baru.
        </p>
      </div>

      {/* MODAL GANTI MODEL */}
      <AnimatePresence>
        {isModelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/70 bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Settings2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      Pilih Model AI (OmniRoute)
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Pilih model preset atau masukkan nama model dari server VPS Anda
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModelModalOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-4 overflow-y-auto">
                {/* Custom Model Input */}
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/60 space-y-2">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    Ketik Model Kustom / Manual:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: google/gemini-2.5-flash atau auto/chat"
                      value={customModelInput}
                      onChange={(e) => setCustomModelInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleApplyCustomModel();
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-foreground"
                    />
                    <Button
                      size="sm"
                      onClick={handleApplyCustomModel}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    >
                      Terapkan
                    </Button>
                  </div>
                </div>

                {/* Preset Models List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Model Pilihan Rekomendasi:
                  </span>
                  <div className="space-y-2">
                    {PRESET_MODELS.map((m) => {
                      const isSelected = selectedModel === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleSelectModel(m.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-emerald-500/10 border-emerald-500/60 shadow-xs"
                              : "bg-card hover:bg-secondary/50 border-border/60"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">
                                {m.name}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  isSelected
                                    ? "bg-emerald-600 text-white"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {m.badge}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{m.desc}</p>
                            <code className="text-[10px] text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded font-mono">
                              {m.id}
                            </code>
                          </div>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-border/70 bg-muted/20 flex justify-between items-center text-xs text-muted-foreground">
                <span>
                  Model aktif saat ini: <strong className="text-foreground">{selectedModel}</strong>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModelModalOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
