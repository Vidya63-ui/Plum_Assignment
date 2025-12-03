import './App.css'
import { AppNavigator } from './navigation/AppNavigator'
import { ArticleProvider } from './state/ArticleContext'
import { ThemeProvider } from './state/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <ArticleProvider>
        <AppNavigator />
      </ArticleProvider>
    </ThemeProvider>
  )
}

export default App

