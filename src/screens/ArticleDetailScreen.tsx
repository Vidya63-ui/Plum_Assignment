import { useNavigate, useParams } from 'react-router-dom'
import { useArticles } from '../state/ArticleContext'

export const ArticleDetailScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    state: { articles, summaries, rewrites, statuses },
    rewriteOne
  } = useArticles()

  const article = articles.find((item) => item.id === id)

  if (!article) {
    return (
      <section className="panel">
        <button className="ghost-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <p className="muted">Article not found. Go back to the feed.</p>
      </section>
    )
  }

  const summary = summaries[article.id]
  const rewrite = rewrites[article.id]
  const status = statuses[article.id]

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <button className="ghost-btn" onClick={() => navigate(-1)}>
            ← Back to feed
          </button>
          <p className="eyebrow">{article.source}</p>
          <h2>{article.title}</h2>
          <p className="muted">
            {article.author && `${article.author} · `}
            {new Date(article.publishedAt).toLocaleString()}
          </p>
        </div>
        <button
          className="primary-btn"
          onClick={() => rewriteOne(article.id)}
          disabled={status?.isRewriting}
        >
          {status?.isRewriting ? 'Rewriting…' : 'Rewrite in friendly tone'}
        </button>
      </div>

      {summary && (
        <section className="summary-block">
          <h3>AI summary</h3>
          <p className="tldr">{summary.tldr}</p>
          <ul>
            {summary.takeaways.map((point, index) => (
              <li key={`${article.id}-detail-${index}`}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="article-content">
        <h3>Original article</h3>
        <p>{article.content}</p>
        <a href={article.url} target="_blank" rel="noreferrer">
          Read on source ↗
        </a>
      </section>

      {status?.rewriteError && (
        <div className="alert error">
          <p>Could not rewrite the article.</p>
          <small>{status.rewriteError}</small>
        </div>
      )}

      {rewrite && (
        <section className="summary-block">
          <h3>Friendly rewrite</h3>
          <p>{rewrite.text}</p>
          <small className="muted">
            Generated {new Date(rewrite.generatedAt).toLocaleString()}
          </small>
        </section>
      )}
    </section>
  )
}

