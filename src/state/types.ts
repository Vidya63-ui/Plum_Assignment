export type Article = {
  id: string
  title: string
  source: string
  publishedAt: string
  author?: string
  content: string
  url: string
}

export type ArticleSummary = {
  tldr: string
  takeaways: string[]
  generatedAt: string
}

export type ArticleRewrite = {
  text: string
  generatedAt: string
}

export type ArticleStatus = {
  isSummarizing: boolean
  summaryError?: string
  isRewriting: boolean
  rewriteError?: string
}

export type ArticleState = {
  articles: Article[]
  summaries: Record<string, ArticleSummary>
  rewrites: Record<string, ArticleRewrite>
  statuses: Record<string, ArticleStatus>
  isLoadingArticles: boolean
  articleLoadError?: string
}

export type ArticleAction =
  | { type: 'ADD_ARTICLE'; payload: Article }
  | { type: 'LOAD_ARTICLES_START' }
  | { type: 'LOAD_ARTICLES_SUCCESS'; payload: Article[] }
  | { type: 'LOAD_ARTICLES_ERROR'; payload: string }
  | { type: 'SUMMARIZE_START'; payload: { id: string } }
  | {
      type: 'SUMMARIZE_SUCCESS'
      payload: { id: string; summary: ArticleSummary }
    }
  | { type: 'SUMMARIZE_ERROR'; payload: { id: string; error: string } }
  | { type: 'REWRITE_START'; payload: { id: string } }
  | {
      type: 'REWRITE_SUCCESS'
      payload: { id: string; rewrite: ArticleRewrite }
    }
  | { type: 'REWRITE_ERROR'; payload: { id: string; error: string } }

