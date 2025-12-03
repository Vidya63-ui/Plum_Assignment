import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { mockArticles } from '../mock/articles'
import { rewriteArticle as rewriteWithAI, summarizeArticle as summarizeWithAI } from '../services/aiService'
import type { Article, ArticleAction, ArticleRewrite, ArticleState, ArticleSummary } from './types'

const STORAGE_KEY = 'health-news-curator'

const initialState: ArticleState = {
  articles: [],
  summaries: {},
  rewrites: {},
  statuses: {},
  isLoadingArticles: false
}

const loadPersistedState = (): ArticleState => {
  if (typeof window === 'undefined') {
    return initialState
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as ArticleState
    return {
      ...initialState,
      ...parsed
    }
  } catch (error) {
    console.warn('Failed to load session data', error)
    return initialState
  }
}

function ensureStatus(state: ArticleState, id: string) {
  if (!state.statuses[id]) {
    state.statuses[id] = {
      isSummarizing: false,
      isRewriting: false
    }
  }
}

const reducer = (state: ArticleState, action: ArticleAction): ArticleState => {
  switch (action.type) {
    case 'ADD_ARTICLE': {
      const statuses = {
        ...state.statuses,
        [action.payload.id]: { isSummarizing: false, isRewriting: false }
      }
      return {
        ...state,
        articles: [action.payload, ...state.articles],
        statuses
      }
    }
    case 'LOAD_ARTICLES_START':
      return { ...state, isLoadingArticles: true, articleLoadError: undefined }
    case 'LOAD_ARTICLES_SUCCESS': {
      const statuses = { ...state.statuses }
      action.payload.forEach((article) => {
        if (!statuses[article.id]) {
          statuses[article.id] = { isSummarizing: false, isRewriting: false }
        }
      })
      return {
        ...state,
        articles: action.payload,
        isLoadingArticles: false,
        articleLoadError: undefined,
        statuses
      }
    }
    case 'LOAD_ARTICLES_ERROR':
      return { ...state, isLoadingArticles: false, articleLoadError: action.payload }
    case 'SUMMARIZE_START': {
      const statuses = { ...state.statuses }
      ensureStatus({ ...state, statuses }, action.payload.id)
      statuses[action.payload.id] = {
        ...statuses[action.payload.id],
        isSummarizing: true,
        summaryError: undefined
      }
      return { ...state, statuses }
    }
    case 'SUMMARIZE_SUCCESS': {
      const summaries: Record<string, ArticleSummary> = {
        ...state.summaries,
        [action.payload.id]: action.payload.summary
      }
      const statuses = { ...state.statuses }
      ensureStatus({ ...state, statuses }, action.payload.id)
      statuses[action.payload.id] = {
        ...statuses[action.payload.id],
        isSummarizing: false,
        summaryError: undefined
      }
      return { ...state, summaries, statuses }
    }
    case 'SUMMARIZE_ERROR': {
      const statuses = { ...state.statuses }
      ensureStatus({ ...state, statuses }, action.payload.id)
      statuses[action.payload.id] = {
        ...statuses[action.payload.id],
        isSummarizing: false,
        summaryError: action.payload.error
      }
      return { ...state, statuses }
    }
    case 'REWRITE_START': {
      const statuses = { ...state.statuses }
      ensureStatus({ ...state, statuses }, action.payload.id)
      statuses[action.payload.id] = {
        ...statuses[action.payload.id],
        isRewriting: true,
        rewriteError: undefined
      }
      return { ...state, statuses }
    }
    case 'REWRITE_SUCCESS': {
      const rewrites: Record<string, ArticleRewrite> = {
        ...state.rewrites,
        [action.payload.id]: action.payload.rewrite
      }
      const statuses = { ...state.statuses }
      ensureStatus({ ...state, statuses }, action.payload.id)
      statuses[action.payload.id] = {
        ...statuses[action.payload.id],
        isRewriting: false,
        rewriteError: undefined
      }
      return { ...state, rewrites, statuses }
    }
    case 'REWRITE_ERROR': {
      const statuses = { ...state.statuses }
      ensureStatus({ ...state, statuses }, action.payload.id)
      statuses[action.payload.id] = {
        ...statuses[action.payload.id],
        isRewriting: false,
        rewriteError: action.payload.error
      }
      return { ...state, statuses }
    }
    default:
      return state
  }
}

type ArticleContextValue = {
  state: ArticleState
  addArticle: (article: Article) => void
  loadArticles: () => Promise<boolean>
  summarizeAll: () => Promise<void>
  summarizeOne: (id: string) => Promise<void>
  rewriteOne: (id: string) => Promise<void>
  refreshSummaries: () => Promise<void>
}

const ArticleContext = createContext<ArticleContextValue | undefined>(undefined)

export const ArticleProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadPersistedState)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addArticle = useCallback((article: Article) => {
    dispatch({ type: 'ADD_ARTICLE', payload: article })
  }, [])

  const loadArticles = useCallback(async () => {
    dispatch({ type: 'LOAD_ARTICLES_START' })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      dispatch({ type: 'LOAD_ARTICLES_SUCCESS', payload: mockArticles })
      return true
    } catch (error) {
      dispatch({
        type: 'LOAD_ARTICLES_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load articles'
      })
      return false
    }
  }, [])

  const summarizeOne = useCallback(
    async (id: string) => {
      const article = state.articles.find((item) => item.id === id)
      if (!article) return
      dispatch({ type: 'SUMMARIZE_START', payload: { id } })
      try {
        const summary = await summarizeWithAI(article.content)
        dispatch({ type: 'SUMMARIZE_SUCCESS', payload: { id, summary } })
      } catch (error) {
        dispatch({
          type: 'SUMMARIZE_ERROR',
          payload: {
            id,
            error: error instanceof Error ? error.message : 'Failed to summarize'
          }
        })
      }
    },
    [state.articles]
  )

  const summarizeAll = useCallback(async () => {
    const tasks = state.articles.map((article) => summarizeOne(article.id))
    await Promise.all(tasks)
  }, [state.articles, summarizeOne])

  const rewriteOne = useCallback(
    async (id: string) => {
      const article = state.articles.find((item) => item.id === id)
      if (!article) return
      dispatch({ type: 'REWRITE_START', payload: { id } })
      try {
        const rewrite = await rewriteWithAI(article.content)
        dispatch({ type: 'REWRITE_SUCCESS', payload: { id, rewrite } })
      } catch (error) {
        dispatch({
          type: 'REWRITE_ERROR',
          payload: {
            id,
            error: error instanceof Error ? error.message : 'Failed to rewrite'
          }
        })
      }
    },
    [state.articles]
  )

  const refreshSummaries = useCallback(async () => {
    await summarizeAll()
  }, [summarizeAll])

  const value = useMemo(
    () => ({
      state,
      addArticle,
      loadArticles,
      summarizeAll,
      summarizeOne,
      rewriteOne,
      refreshSummaries
    }),
    [state, addArticle, loadArticles, summarizeAll, summarizeOne, rewriteOne, refreshSummaries]
  )

  return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>
}

export const useArticles = () => {
  const context = useContext(ArticleContext)
  if (!context) {
    throw new Error('useArticles must be used within ArticleProvider')
  }
  return context
}

