'use client'

import { FileText, CheckCircle2 } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'
import type { DocumentState } from '@/types'

interface Props { document: DocumentState }

export function DocumentSummary({ document }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* File meta */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 12,
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.15)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'rgba(99,102,241,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileText style={{ width: 16, height: 16, color: '#818cf8' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 500, fontSize: 13, color: '#e2e8f0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {document.fileName}
          </p>
          <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0' }}>
            {formatFileSize(document.fileSize)} · {document.pageCount} page{document.pageCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Pages',      value: document.pageCount },
          { label: 'Characters', value: document.extractedText.length.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} style={{
            padding: '14px 12px', borderRadius: 12, textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', margin: '0 0 2px' }}>{value}</p>
            <p style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      {document.truncated && (
        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.18)',
          color: '#fbbf24', fontSize: 12, lineHeight: 1.5,
        }}>
          This document was truncated before chat analysis to control latency and cost. For larger files, the next production step is retrieval-based chunking.
        </div>
      )}

      {/* Summary */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#cbd5e1', margin: '0 0 10px' }}>
          <CheckCircle2 style={{ width: 14, height: 14, color: '#34d399' }} />
          Executive Summary
        </h3>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{document.summary}</p>
      </div>

      {/* Key points */}
      {document.keyPoints.length > 0 && (
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', margin: '0 0 12px' }}>Key Points</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {document.keyPoints.map((pt, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  marginTop: 1, width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#818cf8',
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
