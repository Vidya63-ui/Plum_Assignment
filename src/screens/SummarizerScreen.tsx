import { useState } from 'react'
import { useArticles } from '../state/ArticleContext'

export const SummarizerScreen = () => {
  const {
    state: { articles, summaries, statuses, isLoadingArticles },
    summarizeAll,
    summarizeOne
  } = useArticles()
  const [isBulkSummarizing, setIsBulkSummarizing] = useState(false)

  const handleSummaries = async () => {
    setIsBulkSummarizing(true)
    await summarizeAll()
    setIsBulkSummarizing(false)
  }

  if (!articles.length) {
    return (
      <section className="panel">
        <h2>Step 2 · AI Summarizer</h2>
        <p className="muted">Load articles first to unlock the summarizer workspace.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Step 2 · AI Summarizer</h2>
        <p>Generate TL;DRs and bullet takeaways with one click.</p>
      </div>

      <div className="actions-row">
        <button
          className="primary-btn"
          onClick={handleSummaries}
          disabled={isLoadingArticles || isBulkSummarizing}
        >
          {isBulkSummarizing ? 'Summarizing…' : 'Summarize All'}
        </button>
        <p className="hint muted">
          We send each article through Ollama with the provided system prompt.
        </p>
      </div>

      <div className="article-grid">
        {articles.map((article) => {
          const status = statuses[article.id]
          const summary = summaries[article.id]
          return (
            <article key={article.id} className="card">
              <header>
                <p className="eyebrow">{article.source}</p>
                <h3>{article.title}</h3>
              </header>

              {summary ? (
                <section className="summary-block">
                  <p className="tldr">{summary.tldr}</p>
                  <ul>
                    {summary.takeaways.map((point, index) => (
                      <li key={`${article.id}-takeaway-${index}`}>{point}</li>
                    ))}
                  </ul>
                  <small className="muted">
                    Generated {new Date(summary.generatedAt).toLocaleString()}
                  </small>
                </section>
              ) : (
                <p className="muted">No summary yet. Generate one to preview insights.</p>
              )}

              {status?.summaryError && (
                <div className="alert error">
                  <p>AI summarization failed.</p>
                  <small>{status.summaryError}</small>
                </div>
              )}

              <button
                className="ghost-btn"
                onClick={() => summarizeOne(article.id)}
                disabled={status?.isSummarizing}
              >
                {status?.isSummarizing ? 'Processing…' : summary ? 'Regenerate Summary' : 'Generate'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

