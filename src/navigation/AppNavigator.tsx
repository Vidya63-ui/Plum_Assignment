import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout'
import { ArticleDetailScreen } from '../screens/ArticleDetailScreen'
import { ArticleLoaderScreen } from '../screens/ArticleLoaderScreen'
import { FeedScreen } from '../screens/FeedScreen'
import { SummarizerScreen } from '../screens/SummarizerScreen'

export const AppNavigator = () => (
  <BrowserRouter>
    <AppLayout>
      <Routes>
        <Route path="/" element={<ArticleLoaderScreen />} />
        <Route path="/summaries" element={<SummarizerScreen />} />
        <Route path="/feed" element={<FeedScreen />} />
        <Route path="/article/:id" element={<ArticleDetailScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  </BrowserRouter>
)

