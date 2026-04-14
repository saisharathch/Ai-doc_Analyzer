"use client";

import {
  RotateCcw,
  Zap,
  Shield,
  MessageSquare,
  FileText,
  Sparkles,
} from "lucide-react";
import { DropZone } from "@/components/features/DropZone";
import { DocumentSummary } from "@/components/features/DocumentSummary";
import { ChatInterface } from "@/components/features/ChatInterface";
import { useDocumentAnalysis } from "@/hooks/useDocumentAnalysis";

export default function HomePage() {
  const {
    document,
    messages,
    status,
    error,
    streaming,
    analyzeDocument,
    sendMessage,
    reset,
  } = useDocumentAnalysis();

  const analyzed = document.isAnalyzed;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      {/* ── Ambient background glow ──────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "600px",
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/*  Header  */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(99,102,241,0.4)",
              }}
            >
              <Sparkles style={{ width: 16, height: 16, color: "#fff" }} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#f8fafc",
                  letterSpacing: "-0.02em",
                }}
              >
                AI Document Analyzer
              </span>
              <span style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                PDF Intelligence Workspace
              </span>
            </div>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {analyzed && (
              <div
                style={{
                  display: "none",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                  fontSize: 12,
                }}
                className="md:flex"
              >
                <span
                  style={{
                    maxWidth: 180,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {document.fileName}
                </span>
                <span style={{ color: "#34d399" }}>Analyzed</span>
              </div>
            )}

            {analyzed && (
              <button
                onClick={reset}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#cbd5e1",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                <RotateCcw style={{ width: 12, height: 12 }} />
                New document
              </button>
            )}
          </div>
        </div>
      </header>

      <main
        className="mx-auto max-w-7xl px-5 py-10"
        style={{ position: "relative" }}
      >
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        {!analyzed && status === "idle" && (
          <div
            style={{ textAlign: "center", marginBottom: 48 }}
            className="animate-fade-in"
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 999,
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 24,
              }}
            >
              <Shield style={{ width: 12, height: 12 }} />
              Files processed securely — never stored
            </div>

            {/* Headline */}
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "#f1f5f9",
                marginBottom: 20,
              }}
            >
              Understand any document
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #60a5fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                in seconds
              </span>
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: 16,
                maxWidth: 560,
                margin: "0 auto 40px",
                lineHeight: 1.7,
              }}
            >
              Upload a PDF to generate structured summaries, extract key
              insights, and explore the document through a real-time AI
              conversation.
            </p>

            {/* Feature pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
              }}
            >
              {[
                { icon: Zap, label: "Instant analysis" },
                { icon: MessageSquare, label: "Streaming Q&A" },
                { icon: FileText, label: "PDF support" },
                { icon: Shield, label: "Privacy-first" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <Icon style={{ width: 14, height: 14, color: "#818cf8" }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Upload zone ───────────────────────────────────────────────────── */}
        {!analyzed && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <DropZone onFile={analyzeDocument} status={status} error={error} />
          </div>
        )}

        {/* ── Workspace ────────────────────────────────────────────────────── */}
        {analyzed && (
          <div
            className="animate-slide-up"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 20,
              alignItems: "start",
            }}
          >
            {/* Left — Summary */}
            <div
              style={{
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#f1f5f9",
                      margin: 0,
                    }}
                  >
                    Analysis Workspace
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#475569",
                      margin: "2px 0 0",
                    }}
                  >
                    {document.pageCount} pages ·{" "}
                    {document.extractedText.length.toLocaleString()} characters
                    processed
                    {document.truncated ? " · truncated context" : ""}
                  </p>
                </div>
                <div
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    color: "#a5b4fc",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  Analyzed
                </div>
              </div>
              <div
                className="scrollbar-thin"
                style={{
                  padding: 20,
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 220px)",
                }}
              >
                <DocumentSummary document={document} />
              </div>
            </div>

            {/* Right — Chat */}
            <div
              style={{
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                flexDirection: "column",
                height: "calc(100vh - 160px)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(99,102,241,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MessageSquare
                    style={{ width: 14, height: 14, color: "#818cf8" }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#f1f5f9",
                      margin: 0,
                    }}
                  >
                    Chat with document
                  </p>
                  {messages.length > 0 && (
                    <p
                      style={{
                        fontSize: 11,
                        color: "#475569",
                        margin: "1px 0 0",
                      }}
                    >
                      {Math.ceil(messages.length / 2)} question
                      {messages.length > 2 ? "s" : ""} asked
                    </p>
                  )}
                </div>
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <ChatInterface
                  messages={messages}
                  onSend={sendMessage}
                  isStreaming={streaming}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
  style={{
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: 40,
    padding: '18px 20px 28px',
    color: '#475569',
    fontSize: 12,
  }}
>
  <div
    className="mx-auto max-w-7xl"
    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
  >
    <span>AI Document Analyzer · PDF Intelligence Workspace</span>
    <div style={{ display: 'flex', gap: 14 }}>
      <a
        href="https://github.com/saisharath"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#94a3b8', textDecoration: 'none' }}
      >
        GitHub
      </a>
      <a
        href="https://linkedin.com/in/saisharath"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#94a3b8', textDecoration: 'none' }}
      >
        LinkedIn
      </a>
    </div>
  </div>
</footer>
    </div>
  );
}
