import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useArticles } from '../state/ArticleContext'

const PAGE_SIZE = 10

export const FeedScreen = () => {
  const {
    state: { summaries, articles, statuses },
    refreshSummaries
  } = useArticles()
  const [page, setPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const summarizedArticles = useMemo(
    () =>
      articles
        .filter((article) => summaries[article.id])
        .map((article) => ({
          article,
          summary: summaries[article.id]
        })),
    [articles, summaries]
  )

  const totalPages = Math.max(1, Math.ceil(summarizedArticles.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const visibleItems = summarizedArticles.slice(startIndex, startIndex + PAGE_SIZE)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshSummaries()
    setIsRefreshing(false)
  }

  if (!articles.length) {
    return (
      <section className="panel">
        <h2>Step 3 · Feed View</h2>
        <p className="muted">Load and summarize articles first.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Step 3 · Feed View</h2>
        <p>Review and share AI-prepped summaries. Click through for full articles.</p>
      </div>

      <div className="actions-row">
        <button className="primary-btn" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Refreshing…' : 'Refresh Feed'}
        </button>
        <p className="hint muted">Use this to mimic pull-to-refresh on touch devices.</p>
      </div>

      {!visibleItems.length && (
        <div className="alert info">
          <p>No AI summaries yet.</p>
          <p className="muted">Run summaries first, then revisit the feed.</p>
        </div>
      )}

      <div className="feed-list">
        {visibleItems.map(({ article, summary }) => {
          const status = statuses[article.id]
          return (
            <article key={article.id} className="feed-item">
              <header>
                <h3>{article.title}</h3>
                <p className="muted">
                  {article.source} · {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </header>
              <p className="tldr">{summary.tldr}</p>
              <ul>
                {summary.takeaways.map((takeaway, index) => (
                  <li key={`${article.id}-feed-${index}`}>{takeaway}</li>
                ))}
              </ul>
              {status?.summaryError && (
                <small className="muted">Last error: {status.summaryError}</small>
              )}
              <div className="feed-footer">
                <Link to={`/article/${article.id}`} className="ghost-btn">
                  Open article
                </Link>
                <span className="muted">
                  Updated {new Date(summary.generatedAt).toLocaleTimeString()}
                </span>
              </div>
            </article>
          )
        })}
      </div>

      {visibleItems.length > 0 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

