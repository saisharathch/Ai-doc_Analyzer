'use client'

import { useCallback, useState } from 'react'
import type { AnalyzeResponse, DocumentState, Message, UploadStatus } from '@/types'
import { generateId } from '@/lib/utils'

const EMPTY_DOC: DocumentState = {
  fileName: '',
  fileSize: 0,
  pageCount: 0,
  extractedText: '',
  summary: '',
  keyPoints: [],
  isAnalyzed: false,
  truncated: false,
}

interface ApiErrorResponse {
  error?: {
    message?: string
    code?: string
  } | string
}

function getErrorMessage(payload: ApiErrorResponse, fallback: string): string {
  if (typeof payload.error === 'string') return payload.error
  if (payload.error?.message) return payload.error.message
  return fallback
}

export function useDocumentAnalysis() {
  const [document, setDocument] = useState<DocumentState>(EMPTY_DOC)
  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)

  const analyzeDocument = useCallback(async (file: File) => {
    setStatus('uploading')
    setError(null)
    setMessages([])
    setDocument(EMPTY_DOC)

    try {
      setStatus('extracting')
      const formData = new FormData()
      formData.append('file', file)

      setStatus('analyzing')
      const response = await fetch('/api/analyze', { method: 'POST', body: formData })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(getErrorMessage(payload, 'Analysis failed'))
      }

      const data = payload as AnalyzeResponse
      setDocument({
        fileName: file.name,
        fileSize: file.size,
        pageCount: data.pageCount,
        extractedText: data.extractedText,
        summary: data.summary,
        keyPoints: data.keyPoints ?? [],
        isAnalyzed: true,
        truncated: Boolean(data.truncated),
      })
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }, [])

  const sendMessage = useCallback(async (question: string) => {
    const trimmedQuestion = question.trim()
    if (!document.extractedText || !trimmedQuestion || streaming) return

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: trimmedQuestion,
      timestamp: new Date().toISOString(),
    }
    const assistantId = generateId()
    const assistantPlaceholder: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    }

    const nextMessages = [...messages, userMsg]
    setMessages([...nextMessages, assistantPlaceholder])
    setStreaming(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmedQuestion,
          documentText: document.extractedText,
          history: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as ApiErrorResponse
        throw new Error(getErrorMessage(payload, 'Stream request failed'))
      }

      if (!response.body) {
        throw new Error('Streaming response body is missing')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        accumulated += decoder.decode(value, { stream: true })
        setMessages(prev => prev.map(message => (
          message.id === assistantId ? { ...message, content: accumulated } : message
        )))
      }

      accumulated += decoder.decode()
      setMessages(prev => prev.map(message => (
        message.id === assistantId ? { ...message, content: accumulated.trim() } : message
      )))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev => prev.map(entry => (
        entry.id === assistantId ? { ...entry, content: `Error: ${message}` } : entry
      )))
    } finally {
      setStreaming(false)
    }
  }, [document.extractedText, messages, streaming])

  const reset = useCallback(() => {
    setDocument(EMPTY_DOC)
    setMessages([])
    setStatus('idle')
    setError(null)
    setStreaming(false)
  }, [])

  return { document, messages, status, error, streaming, analyzeDocument, sendMessage, reset }
}
