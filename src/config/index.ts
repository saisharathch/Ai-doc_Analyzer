const DEFAULT_MAX_FILE_SIZE_MB = 10
const DEFAULT_ANALYZE_CONTEXT_CHARS = 150_000
const DEFAULT_CHAT_CONTEXT_CHARS = 100_000
const DEFAULT_MAX_HISTORY_MESSAGES = 10
const DEFAULT_ANALYSIS_TEXT_RETURN_CHARS = 100_000

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const APP_CONFIG = {
  maxFileSizeMb: parsePositiveInt(process.env.MAX_FILE_SIZE_MB, DEFAULT_MAX_FILE_SIZE_MB),
  analyzeContextChars: parsePositiveInt(process.env.ANALYZE_CONTEXT_CHARS, DEFAULT_ANALYZE_CONTEXT_CHARS),
  chatContextChars: parsePositiveInt(process.env.CHAT_CONTEXT_CHARS, DEFAULT_CHAT_CONTEXT_CHARS),
  maxHistoryMessages: parsePositiveInt(process.env.MAX_HISTORY_MESSAGES, DEFAULT_MAX_HISTORY_MESSAGES),
  analysisTextReturnChars: parsePositiveInt(process.env.ANALYSIS_TEXT_RETURN_CHARS, DEFAULT_ANALYSIS_TEXT_RETURN_CHARS),
} as const

export const MAX_FILE_BYTES = APP_CONFIG.maxFileSizeMb * 1024 * 1024
