import pdfParse from 'pdf-parse'

export interface ParsedPDF {
  text: string
  pageCount: number
  wordCount: number
}

function isPdfSignature(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).toString('utf8') === '%PDF-'
}

export async function extractTextFromPDF(buffer: Buffer): Promise<ParsedPDF> {
  if (!isPdfSignature(buffer)) {
    throw new Error('Invalid PDF file signature')
  }

  try {
    const data = await pdfParse(buffer)
    const normalizedText = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\u0000/g, '')
      .replace(/[\t\f\v ]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    const wordCount = normalizedText ? normalizedText.split(/\s+/).filter(Boolean).length : 0

    return {
      text: normalizedText,
      pageCount: data.numpages,
      wordCount,
    }
  } catch {
    throw new Error('Failed to parse PDF. Please ensure the file is a valid, non-encrypted PDF.')
  }
}

export function truncateForContext(text: string, maxChars = 150_000): string {
  if (text.length <= maxChars) return text
  return `${text.slice(0, maxChars)}\n\n[Document truncated for analysis due to size limits.]`
}
