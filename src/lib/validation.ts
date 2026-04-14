import { MAX_FILE_BYTES } from '@/config'

export interface ChatHistoryEntry {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequestBody {
  question: string
  documentText: string
  history: ChatHistoryEntry[]
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function validatePdfFile(file: File | null): { valid: true } | { valid: false; message: string; status: number } {
  if (!file) {
    return { valid: false, message: 'No file provided', status: 400 }
  }

  const hasPdfMimeType = file.type === 'application/pdf'
  const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf')

  if (!hasPdfMimeType && !hasPdfExtension) {
    return { valid: false, message: 'Only PDF files are supported', status: 400 }
  }

  if (file.size <= 0) {
    return { valid: false, message: 'Uploaded file is empty', status: 400 }
  }

  if (file.size > MAX_FILE_BYTES) {
    return { valid: false, message: `File too large (max ${Math.floor(MAX_FILE_BYTES / 1024 / 1024)} MB)`, status: 400 }
  }

  return { valid: true }
}

export function validateChatRequest(payload: unknown): { success: true; data: ChatRequestBody } | { success: false; message: string } {
  if (!isObject(payload)) {
    return { success: false, message: 'Invalid request body' }
  }

  const question = typeof payload.question === 'string' ? payload.question.trim() : ''
  const documentText = typeof payload.documentText === 'string' ? payload.documentText.trim() : ''
  const rawHistory = Array.isArray(payload.history) ? payload.history : []

  if (!question) {
    return { success: false, message: 'No question provided' }
  }

  if (!documentText) {
    return { success: false, message: 'No document context' }
  }

  const history: ChatHistoryEntry[] = rawHistory
    .filter((entry): entry is ChatHistoryEntry => {
      return isObject(entry)
        && (entry.role === 'user' || entry.role === 'assistant')
        && typeof entry.content === 'string'
    })
    .map(entry => ({
      role: entry.role,
      content: entry.content.trim(),
    }))
    .filter(entry => entry.content.length > 0)

  return {
    success: true,
    data: { question, documentText, history },
  }
}
