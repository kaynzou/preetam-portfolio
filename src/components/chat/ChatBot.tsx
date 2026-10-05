"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/profile";

type Message = { role: "user" | "assistant"; content: string };

const MAX_USER_MESSAGES = 10;
const suggestions = ["What are you working on?", "Tell me about your projects", "What's your tech stack?"];

// Minimal typing for the browser's (prefixed) SpeechRecognition API
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionCtor = new () => Recognition;

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState(false); // stop the attention ping after first open
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const userCount = messages.filter((m) => m.role === "user").length;
  const limitReached = userCount >= MAX_USER_MESSAGES;
  const busy = thinking || streaming;

  useEffect(() => {
    fetch("/api/tts")
      .then((r) => r.json())
      .then((d: { enabled: boolean }) => setVoiceAvailable(d.enabled))
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  async function speakText(text: string) {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const ctx = (audioCtxRef.current ??= new AudioContext());
      const buffer = await ctx.decodeAudioData(await res.arrayBuffer());
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch {
      // voice is a nice-to-have; ignore failures
    }
  }

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || busy || limitReached) return;
    const history: Message[] = [...messages, { role: "user", content }];
    setMessages(history);
    setInput("");
    setThinking(true);

    let full = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const reason =
          res.status === 429
            ? "Whoa, that's a lot of questions! Take a breather and try again in a bit."
            : res.status === 503
              ? `My chat assistant is still being set up. In the meantime, ${profile.email ? `reach me at ${profile.email}` : "use the links on this page to reach me"}.`
              : "Something went wrong. Please try again.";
        setMessages([...history, { role: "assistant", content: reason }]);
        return;
      }

      setThinking(false);
      setStreaming(true);
      setMessages([...history, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
          full += (JSON.parse(line.slice(6)) as { text: string }).text;
          setMessages([...history, { role: "assistant", content: full }]);
        }
      }
      if (voiceEnabled && full) speakText(full);
    } catch {
      setMessages([...history, { role: "assistant", content: "Couldn't reach the campfire. Check your connection and try again." }]);
    } finally {
      setThinking(false);
      setStreaming(false);
    }
  }

  function getRecognition() {
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    return w.SpeechRecognition || w.webkitSpeechRecognition;
  }

  function toggleOpen() {
    setMicSupported(Boolean(getRecognition()));
    setOpened(true);
    setOpen((o) => !o);
  }

  function toggleListening() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Ctor = getRecognition();
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => sendMessage(e.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <>
      <motion.button
        onClick={toggleOpen}
        aria-label={open ? "Close chat" : "Ask me anything"}
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 1.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-2xl border border-gold/50 bg-gradient-to-b from-[#3a2d1c] to-[#1f1912] text-gold shadow-[0_0_24px_rgba(232,176,75,0.35)]"
      >
        {!opened && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-2xl border-2 border-gold/60"
            animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 2.5 }}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="quill"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              {/* quill */}
              <path d="M20 4C12 4 7 9 6 18l-2 2" />
              <path d="M20 4c0 7-4 12-12 13" />
              <path d="M9 13h5M11 10h5" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-3 bottom-24 z-50 flex h-[min(600px,calc(100svh-8rem))] flex-col overflow-hidden rounded-2xl border border-gold/25 bg-[#1a140e]/95 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:right-5 sm:w-[420px]"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <p className="font-display text-sm font-bold text-[#f6ecd9]">Ask {profile.firstName}</p>
                  <p className="text-[10px] text-[#f6ecd9]/50">AI assistant · usually answers in seconds</p>
                </div>
              </div>
              {voiceAvailable && (
                <button
                  onClick={() => setVoiceEnabled((v) => !v)}
                  aria-label={voiceEnabled ? "Mute voice replies" : "Enable voice replies"}
                  title={voiceEnabled ? "Voice on" : "Voice off"}
                  className={`grid h-8 w-8 place-items-center rounded-lg border transition ${voiceEnabled ? "border-gold/60 text-gold" : "border-white/10 text-white/40"}`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5 6 9H2v6h4l5 4V5z" />
                    {voiceEnabled ? <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /> : <path d="M22 9l-6 6M16 9l6 6" />}
                  </svg>
                </button>
              )}
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-2.5 text-sm text-[#f6ecd9]/85">
                    Hey, traveller! 👋 Ask me anything about {profile.firstName}: projects, experience, or what they&apos;re up to.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={s}
                        onClick={() => sendMessage(s)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold/90 transition-colors hover:bg-gold/10"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) =>
                m.content || m.role === "user" ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, x: m.role === "user" ? 12 : -12 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[85%] whitespace-pre-wrap px-3.5 py-2.5 text-sm ${
                        m.role === "user" ? "rounded-2xl rounded-tr-sm bg-ember text-[#1a0f08]" : "rounded-2xl rounded-tl-sm bg-white/5 text-[#f6ecd9]/85"
                      }`}
                    >
                      {m.content}
                    </p>
                  </motion.div>
                ) : null,
              )}
              {thinking && (
                <div className="flex w-fit gap-1 rounded-2xl rounded-tl-sm bg-white/5 px-4 py-3.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-gold"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}
              {limitReached && !busy && (
                <p className="rounded-xl border border-gold/20 bg-gold/5 px-3 py-2 text-center text-xs text-[#f6ecd9]/70">
                  That&apos;s all the questions for this campfire!{" "}
                  {profile.email ? (
                    <>
                      For more, reach out at{" "}
                      <a className="text-gold underline" href={`mailto:${profile.email}`}>
                        {profile.email}
                      </a>
                      .
                    </>
                  ) : (
                    "For more, use the links on this page."
                  )}
                </p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={limitReached}
                placeholder={listening ? "Listening…" : limitReached ? "Question limit reached" : "Ask me anything…"}
                maxLength={500}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-[#f6ecd9] placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
              />
              {micSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={busy || limitReached}
                  aria-label={listening ? "Stop listening" : "Speak your question"}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition disabled:opacity-40 ${
                    listening ? "animate-pulse border-red-400 text-red-400" : "border-white/10 text-white/60 hover:text-gold"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="2" width="6" height="12" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0M12 17v5" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={!input.trim() || busy || limitReached}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ember text-[#1a0f08] transition hover:brightness-110 disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
