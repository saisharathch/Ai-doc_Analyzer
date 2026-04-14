export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface DocumentState {
  fileName: string
  fileSize: number
  pageCount: number
  extractedText: string
  summary: string
  keyPoints: string[]
  isAnalyzed: boolean
  truncated?: boolean
}

export interface AnalyzeResponse {
  summary: string
  keyPoints: string[]
  pageCount: number
  wordCount: number
  extractedText: string
  truncated?: boolean
}

export type UploadStatus =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'analyzing'
  | 'done'
  | 'error'
