'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react'
import type { UploadStatus } from '@/types'

interface Props {
  onFile:  (file: File) => void
  status:  UploadStatus
  error:   string | null
}

const STATUS_LABELS: Record<UploadStatus, string> = {
  idle:       'Drop your PDF here, or click to browse',
  uploading:  'Uploading…',
  extracting: 'Extracting text from PDF…',
  analyzing:  'Analyzing with AI…',
  done:       'Analysis complete',
  error:      'Upload failed',
}

export function DropZone({ onFile, status, error }: Props) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: ['uploading', 'extracting', 'analyzing'].includes(status),
  })

  const busy = ['uploading', 'extracting', 'analyzing'].includes(status)

  return (
    <div
      {...getRootProps()}
      style={{
        borderRadius: 20,
        border: `2px dashed ${error ? 'rgba(239,68,68,0.4)' : isDragActive ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.1)'}`,
        background: error ? 'rgba(239,68,68,0.05)' : isDragActive ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
        padding: '64px 40px',
        textAlign: 'center',
        cursor: busy ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        transform: isDragActive ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <input {...getInputProps()} />

      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: error ? 'rgba(239,68,68,0.12)' : 'rgba(99,102,241,0.12)',
        border: `1px solid ${error ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        {error
          ? <AlertCircle style={{ width: 32, height: 32, color: '#f87171' }} />
          : busy
          ? <Loader2 style={{ width: 32, height: 32, color: '#818cf8', animation: 'spin 1s linear infinite' }} />
          : <Upload   style={{ width: 32, height: 32, color: '#818cf8' }} />
        }
      </div>

      <p style={{ fontSize: 18, fontWeight: 600, color: error ? '#f87171' : '#e2e8f0', marginBottom: 8 }}>
        {busy ? STATUS_LABELS[status] : error ? 'Upload failed' : STATUS_LABELS.idle}
      </p>

      {!busy && !error && (
        <p style={{ fontSize: 13, color: '#475569', marginBottom: 32 }}>PDF files only · Max 10 MB</p>
      )}
      {error && <p style={{ fontSize: 13, color: '#f87171', marginBottom: 24 }}>{error}</p>}

      {busy && (
        <div style={{ width: 200, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', margin: '20px auto 0' }}>
          <div style={{ height: '100%', width: '60%', borderRadius: 99, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
      )}

      {!busy && !error && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 24px', borderRadius: 10,
          background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.3)',
          color: '#a5b4fc', fontSize: 13, fontWeight: 500,
        }}>
          <FileText style={{ width: 14, height: 14 }} />
          Choose a PDF file
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:.5; } 50% { opacity:1; } }
      `}</style>
    </div>
  )
}
