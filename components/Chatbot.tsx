"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";

type Message = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 10;

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const limitReached = userMessageCount >= MAX_MESSAGES;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isThinking]);

  async function sendMessage(userMessage: string) {
    if (!userMessage.trim() || limitReached || isThinking) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsThinking(true);

    let fullResponse = "";
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok || !response.body) throw new Error("Chat request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Push a placeholder assistant message we update as text streams in
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const { text } = JSON.parse(line.slice(6));
              fullResponse += text;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: fullResponse };
                return copy;
              });
            } catch {
              // ignore malformed chunk
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong reaching the API. Check your ANTHROPIC_API_KEY.",
        },
      ]);
    } finally {
      setIsThinking(false);
      if (voiceEnabled && fullResponse) speakText(fullResponse);
    }
  }

  async function speakText(text: string) {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) return;
      const arrayBuffer = await response.arrayBuffer();
      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch {
      // voice is best-effort; fail silently and leave the text response visible
    }
  }

  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="focus-ring fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-[#E8823A] text-[#0B1420] flex items-center justify-center shadow-lg shadow-black/40 hover:scale-105 transition-transform"
      >
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[420px] h-[600px] max-h-[70vh] bg-[#0B1420] border border-[#F3ECDD]/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F3ECDD]/10 flex items-center justify-between">
            <div>
              <p className="text-[#F3ECDD] font-medium text-sm">
                Ask about {profile.name.split(" ")[0]}
              </p>
              <p className="text-[#D9C39F]/50 text-xs">
                {limitReached
                  ? "Session limit reached"
                  : `${MAX_MESSAGES - userMessageCount} messages left`}
              </p>
            </div>
            <button
              onClick={() => setVoiceEnabled((v) => !v)}
              aria-label="Toggle voice replies"
              className={`focus-ring w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                voiceEnabled
                  ? "bg-[#E8823A] text-[#0B1420]"
                  : "bg-[#F3ECDD]/10 text-[#F3ECDD]"
              }`}
            >
              🔊
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-[#D9C39F]/50 text-sm">
                Ask me anything about {profile.name}&apos;s background, skills, or
                projects.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#E8823A] text-[#0B1420]"
                      : "bg-[#F3ECDD]/10 text-[#F3ECDD]"
                  }`}
                >
                  {m.content || (isThinking && i === messages.length - 1 ? "···" : "")}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 border-t border-[#F3ECDD]/10 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={startListening}
              disabled={limitReached}
              aria-label="Speak your question"
              className={`focus-ring w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sm ${
                isListening ? "bg-[#E8823A] text-[#0B1420]" : "bg-[#F3ECDD]/10 text-[#F3ECDD]"
              }`}
            >
              🎙
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={limitReached ? "Session limit reached" : "Type a question..."}
              disabled={limitReached}
              className="flex-1 bg-[#F3ECDD]/5 rounded-full px-4 py-2 text-sm text-[#F3ECDD] placeholder:text-[#D9C39F]/40 focus-ring outline-none"
            />
            <button
              type="submit"
              disabled={limitReached || isThinking || !input.trim()}
              className="focus-ring px-4 py-2 rounded-full bg-[#E8823A] text-[#0B1420] text-sm font-medium disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
