import { useState } from 'react'
import type { FormEvent } from 'react'

export type ArticleFormPayload = {
  title: string
  source: string
  author?: string
  url: string
  publishedAt: string
  description?: string
  content: string
  autoSummarize: boolean
}

type Props = {
  onSubmit: (payload: ArticleFormPayload) => Promise<void>
}

const initialState: ArticleFormPayload = {
  title: '',
  source: '',
  author: '',
  url: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  description: '',
  content: '',
  autoSummarize: true
}

export const ArticleUploadForm = ({ onSubmit }: Props) => {
  const [form, setForm] = useState<ArticleFormPayload>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()

  const handleChange = (field: keyof ArticleFormPayload, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setForm(initialState)
    setTimeout(() => setSuccess(undefined), 4000)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(undefined)
    setSuccess(undefined)

    if (!form.title.trim() || !form.content.trim() || !form.url.trim()) {
      setError('Title, URL, and full article text are required.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(form)
      setSuccess('Article ingested successfully.')
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add article.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Website title *</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => handleChange('title', event.target.value)}
            placeholder="e.g., Breakthrough therapy for type 2 diabetes"
            required
          />
        </label>
        <label>
          <span>Source / publication</span>
          <input
            type="text"
            value={form.source}
            onChange={(event) => handleChange('source', event.target.value)}
            placeholder="Healthline"
          />
        </label>
        <label>
          <span>Author</span>
          <input
            type="text"
            value={form.author}
            onChange={(event) => handleChange('author', event.target.value)}
            placeholder="Dr. Jane Editor"
          />
        </label>
        <label>
          <span>Published on</span>
          <input
            type="date"
            value={form.publishedAt}
            onChange={(event) => handleChange('publishedAt', event.target.value)}
          />
        </label>
        <label className="full-width">
          <span>Article URL *</span>
          <input
            type="url"
            value={form.url}
            onChange={(event) => handleChange('url', event.target.value)}
            placeholder="https://example.com/health-story"
            required
          />
        </label>
        <label className="full-width">
          <span>Short description</span>
          <textarea
            rows={2}
            value={form.description}
            onChange={(event) => handleChange('description', event.target.value)}
            placeholder="Optional teaser or deck copy..."
          />
        </label>
      </div>

      <label className="full-width">
        <span>Full article text *</span>
        <textarea
          rows={6}
          value={form.content}
          onChange={(event) => handleChange('content', event.target.value)}
          placeholder="Paste the body of the article here..."
          required
        />
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={form.autoSummarize}
          onChange={(event) => handleChange('autoSummarize', event.target.checked)}
        />
        <span>Automatically summarize after upload</span>
      </label>

      <div className="form-footer">
        <button className="primary-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding…' : 'Add article to feed'}
        </button>
        <p className="hint muted">We store it locally only for this session.</p>
      </div>

      {error && (
        <div className="alert error">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="alert info">
          <p>{success}</p>
        </div>
      )}
    </form>
  )
}

