import type { ArticleRewrite, ArticleSummary } from '../state/types'

const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL_NAME = 'llama3.2'

type OllamaResponse = {
  response?: string
  error?: string
}

const summaryPromptTemplate = (content: string) => `You are a health news summarizer.
Summarize this article into:
1. A 2-line TL;DR (max 30 words)
2. 3 key takeaways in bullet points
Maintain medical accuracy. Keep it readable and neutral.

Article:
${content}

Format exactly as:
TLDR: <2 lines within 30 words>
TAKEAWAYS:
- <bullet 1>
- <bullet 2>
- <bullet 3>`

const rewritePromptTemplate = (content: string) => `Rewrite the following article in a simple, friendly, beginner-level tone.
Avoid medical jargon unless necessary.
Keep it 20–30% shorter.

Text:
${content}

Format:
REWRITE:
<text>`

async function callOllama(prompt: string, signal?: AbortSignal): Promise<string> {
  const body = JSON.stringify({
    model: MODEL_NAME,
    prompt,
    stream: false
  })

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
    signal
  })

  if (!response.ok) {
    const errorPayload = await response.text()
    throw new Error(`Ollama error ${response.status}: ${errorPayload}`)
  }

  const data = (await response.json()) as OllamaResponse
  if (data.error) {
    throw new Error(data.error)
  }
  if (!data.response) {
    throw new Error('No response body from Ollama')
  }
  return data.response.trim()
}

const normalizeTrailingDots = (text: string) => {
  const trimmed = text.trim()
  if (trimmed.endsWith('...')) {
    return trimmed
  }
  return trimmed.replace(/\.{2,}$/g, '.')
}

const sanitizeListItem = (text: string) =>
  normalizeTrailingDots(text).replace(/^[•\-–\*\s]+/, '').trim()

const parseSummary = (raw: string): ArticleSummary => {
  const [tldrPart = '', takeawaysPart = ''] = raw.split('TAKEAWAYS:')
  const tldr = normalizeTrailingDots(tldrPart.replace('TLDR:', '').trim())
  const takeaways = takeawaysPart
    .split('\n')
    .map((line) => sanitizeListItem(line))
    .filter((line) => !!line)
    .slice(0, 3)

  return {
    tldr,
    takeaways,
    generatedAt: new Date().toISOString()
  }
}

const fallbackSummary = (content: string): ArticleSummary => {
  const sentences = content.split('.').map((s) => s.trim()).filter(Boolean)
  const tldr = normalizeTrailingDots(
    sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '...' : '')
  )
  const takeaways = sentences.slice(2, 5).map(sanitizeListItem)
  return {
    tldr,
    takeaways,
    generatedAt: new Date().toISOString()
  }
}

export async function summarizeArticle(
  content: string,
  signal?: AbortSignal
): Promise<ArticleSummary> {
  try {
    const prompt = summaryPromptTemplate(content)
    const raw = await callOllama(prompt, signal)
    return parseSummary(raw)
  } catch (error) {
    console.error('summarizeArticle fallback', error)
    return fallbackSummary(content)
  }
}

export async function rewriteArticle(
  content: string,
  signal?: AbortSignal
): Promise<ArticleRewrite> {
  try {
    const prompt = rewritePromptTemplate(content)
    const raw = await callOllama(prompt, signal)
    const cleaned = raw.replace('REWRITE:', '').trim()
    return {
      text: cleaned,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('rewriteArticle fallback', error)
    // provide trimmed fallback text
    const shortened = content.slice(0, Math.floor(content.length * 0.8))
    return {
      text: shortened,
      generatedAt: new Date().toISOString()
    }
  }
}

