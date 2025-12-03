import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArticleUploadForm, type ArticleFormPayload } from '../components/ArticleUploadForm'
import { useArticles } from '../state/ArticleContext'

export const ArticleLoaderScreen = () => {
  const navigate = useNavigate()
  const {
    loadArticles,
    addArticle,
    summarizeOne,
    state: { isLoadingArticles, articleLoadError, articles }
  } = useArticles()
  const [hasStarted, setHasStarted] = useState(false)
  const [isCustomFlowBusy, setIsCustomFlowBusy] = useState(false)

  const handleLoad = async () => {
    setHasStarted(true)
    const success = await loadArticles()
    if (success) {
      navigate('/summaries')
    }
  }

  const handleManualSubmit = async (payload: ArticleFormPayload) => {
    setIsCustomFlowBusy(true)
    const id = crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`
    addArticle({
      id,
      title: payload.title,
      source: payload.source || 'Custom upload',
      publishedAt: payload.publishedAt
        ? new Date(payload.publishedAt).toISOString()
        : new Date().toISOString(),
      author: payload.author,
      url: payload.url,
      content: payload.description
        ? `${payload.description}\n\n${payload.content}`
        : payload.content
    })

    if (payload.autoSummarize) {
      await summarizeOne(id)
      navigate('/summaries')
    }
    setIsCustomFlowBusy(false)
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Step 1 · Article Loader</h2>
        <p>Import vetted health stories before sending them through AI.</p>
      </div>

      <div className="cta-tile">
        <div>
          <h3>Load curated health articles</h3>
          <p>
            We start with a verified dataset. Once loaded, you can move to the AI summarizer
            workspace.
          </p>
        </div>
        <button className="primary-btn" onClick={handleLoad} disabled={isLoadingArticles}>
          {isLoadingArticles ? 'Loading…' : articles.length ? 'Reload Articles' : 'Start'}
        </button>
      </div>

      {hasStarted && isLoadingArticles && (
        <p className="hint muted">Fetching articles from the mock feed...</p>
      )}

      {articleLoadError && (
        <div className="alert error">
          <p>Could not load articles. Please try again.</p>
          <small>{articleLoadError}</small>
        </div>
      )}

      {articles.length > 0 && !isLoadingArticles && (
        <div className="success-card">
          <h4>{articles.length} articles loaded</h4>
          <p>Head over to the Summaries tab to run AI processing.</p>
        </div>
      )}

      <div className="panel-divider" />

      <div>
        <div className="panel-header">
          <h3>Manual article ingest</h3>
          <p className="muted">
            Paste details from any website. We will store it locally and optionally run the AI
            summarizer instantly.
          </p>
        </div>
        <ArticleUploadForm onSubmit={handleManualSubmit} />
        {isCustomFlowBusy && <p className="hint muted">Processing your article…</p>}
      </div>
    </section>
  )
}

