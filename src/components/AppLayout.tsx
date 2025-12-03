import { NavLink } from 'react-router-dom'
import { useTheme } from '../state/ThemeContext'
import './AppLayout.css'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">AI Health News Curator</p>
          <h1>Health Intel Studio</h1>
        </div>
        <nav>
          <NavLink to="/" className="nav-link">
            Loader
          </NavLink>
          <NavLink to="/summaries" className="nav-link">
            Summaries
          </NavLink>
          <NavLink to="/feed" className="nav-link">
            Feed
          </NavLink>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
          <span className="theme-icon">{theme === 'light' ? '🌞' : '🌙'}</span>
          <span>{theme === 'light' ? 'Light' : 'Dark'} mode</span>
        </button>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}

