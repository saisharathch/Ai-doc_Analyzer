"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import type { Message } from "@/types";

interface Props {
  messages: Message[];
  onSend: (q: string) => void;
  isStreaming: boolean;
}

const SUGGESTED = [
  "What is the main topic of this document?",
  "Summarize the key findings in 3 bullet points.",
  "What are the most important conclusions?",
  "Are there any recommendations or action items?",
];

export function ChatInterface({ messages, onSend, isStreaming }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const q = input.trim();
    if (!q || isStreaming) return;
    onSend(q);
    setInput("");
    textareaRef.current?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages */}
      <div
        className="scrollbar-thin"
        style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}
      >
        {messages.length === 0 ? (
          <div style={{ paddingTop: 8 }}>
            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "#475569",
                marginBottom: 16,
              }}
            >
              Start a conversation with your document
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#64748b",
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.08)";
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                    e.currentTarget.style.color = "#a5b4fc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "#64748b";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: 10,
                  animation: "fadeIn .25s ease",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    flexShrink: 0,
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                        : "rgba(255,255,255,0.06)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      msg.role === "user"
                        ? "0 0 12px rgba(99,102,241,0.3)"
                        : "none",
                  }}
                >
                  {msg.role === "user" ? (
                    <User style={{ width: 13, height: 13, color: "#fff" }} />
                  ) : (
                    <Bot style={{ width: 13, height: 13, color: "#64748b" }} />
                  )}
                </div>

                {/* Bubble */}
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 14px",
                    borderRadius: 12,
                    fontSize: 13,
                    lineHeight: 1.65,
                    ...(msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.2))",
                          border: "1px solid rgba(99,102,241,0.25)",
                          color: "#e2e8f0",
                          borderTopRightRadius: 4,
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#94a3b8",
                          borderTopLeftRadius: 4,
                        }),
                  }}
                >
                  {msg.content || (
                    <Loader2
                      style={{
                        width: 14,
                        height: 14,
                        color: "#475569",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            transition: "border-color .15s",
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isStreaming}
placeholder="Ask about findings, topics, risks, conclusions, or key details…"
            style={{
              flex: 1,
              resize: "none",
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 13,
              color: "#e2e8f0",
              lineHeight: 1.5,
              maxHeight: 120,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              flexShrink: 0,
              background:
                input.trim() && !isStreaming
                  ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                  : "rgba(255,255,255,0.06)",
              border: "none",
              cursor: input.trim() && !isStreaming ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all .15s",
              boxShadow:
                input.trim() && !isStreaming
                  ? "0 0 12px rgba(99,102,241,0.35)"
                  : "none",
            }}
          >
            {isStreaming ? (
              <Loader2
                style={{
                  width: 14,
                  height: 14,
                  color: "#475569",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : (
              <Send
                style={{
                  width: 14,
                  height: 14,
                  color: input.trim() ? "#fff" : "#475569",
                }}
              />
            )}
          </button>
        </div>
        <p
          style={{
            marginTop: 6,
            textAlign: "center",
            fontSize: 10,
            color: "#334155",
          }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin   { from { transform:rotate(0deg); }             to   { transform:rotate(360deg); } }
        textarea::placeholder { color: #334155; }
      `}</style>
    </div>
  );
}
