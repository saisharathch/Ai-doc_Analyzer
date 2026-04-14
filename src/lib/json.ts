export interface ParsedAnalysis {
  summary: string
  keyPoints: string[]
  topic: string
}

function isParsedAnalysis(value: unknown): value is ParsedAnalysis {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.summary === 'string'
    && Array.isArray(candidate.keyPoints)
    && candidate.keyPoints.every(item => typeof item === 'string')
    && typeof candidate.topic === 'string'
}

export function safeParseAnalysisJson(text: string): ParsedAnalysis | null {
  const candidates = [text]
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fencedMatch?.[1]) candidates.push(fencedMatch[1])
  const braceMatch = text.match(/\{[\s\S]*\}/)
  if (braceMatch?.[0]) candidates.push(braceMatch[0])

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate)
      if (isParsedAnalysis(parsed)) {
        return {
          summary: parsed.summary.trim(),
          keyPoints: parsed.keyPoints.map(point => point.trim()).filter(Boolean),
          topic: parsed.topic.trim(),
        }
      }
    } catch {
      // continue
    }
  }

  return null
}
