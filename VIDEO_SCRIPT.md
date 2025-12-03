# Video Script: AI Health News Curator Project

## Introduction (0:00 - 0:30)

**[Screen: Show the running application]**

"Hello! Today I'm going to walk you through my AI Health News Curator project. This is a web application I built that helps health editors quickly process, summarize, and rewrite health news articles using AI. Let me show you how it works and the code behind it."

---

## Part 1: Project Overview & Problem Statement (0:30 - 1:30)

**[Screen: Show README or project structure]**

"This project solves a real problem: health editors need a fast way to:
- Load trusted health articles
- Generate AI-powered summaries with key takeaways
- Create simplified, beginner-friendly rewrites
- Manage everything in an organized dashboard

The application has four main screens that guide users through this workflow."

**[Screen: Navigate through the app showing all screens]**

---

## Part 2: Technology Stack (1:30 - 2:30)

**[Screen: Show package.json or terminal]**

"Let me show you the technologies I used:

**Frontend Framework:**
- React 19.2 with TypeScript for type-safe, modern UI development
- Vite as the build tool for fast development and optimized production builds

**Routing:**
- React Router DOM for navigation between screens

**State Management:**
- React Context API with useReducer for global state management
- Session storage for persistence during the session

**AI Integration:**
- Ollama 3.2 running locally for AI summarization and rewriting
- Custom service layer to handle AI API calls

**No external UI libraries** - I built all components from scratch for full control."

**[Screen: Show package.json file]**

---

## Part 3: Application Architecture (2:30 - 4:00)

**[Screen: Show folder structure]**

"Let me break down the architecture:

**Entry Point:**
- `App.tsx` - Wraps the app with ThemeProvider and ArticleProvider
- `main.tsx` - React app initialization

**Navigation:**
- `navigation/AppNavigator.tsx` - Defines all routes using React Router

**State Management:**
- `state/ArticleContext.tsx` - Global state for articles, summaries, and rewrites
- `state/ThemeContext.tsx` - Dark/light mode management
- `state/types.ts` - TypeScript type definitions

**Services:**
- `services/aiService.ts` - Handles all Ollama API calls and response parsing

**Screens:**
- `screens/ArticleLoaderScreen.tsx` - Load articles screen
- `screens/SummarizerScreen.tsx` - AI summarization interface
- `screens/FeedScreen.tsx` - Paginated article feed
- `screens/ArticleDetailScreen.tsx` - Full article view with rewrite feature

**Components:**
- `components/AppLayout.tsx` - Main layout with navigation
- `components/ArticleUploadForm.tsx` - Manual article upload form

**Mock Data:**
- `mock/articles.ts` - Sample health articles for testing"

**[Screen: Show the folder structure in VS Code]**

---

## Part 4: Code Deep Dive - State Management (4:00 - 6:00)

**[Screen: Open ArticleContext.tsx]**

"Let's look at the heart of the application - the state management. The `ArticleContext.tsx` file uses React's Context API with a reducer pattern."

**[Highlight key sections]**

"Here's how it works:

1. **Initial State**: Stores articles array, summaries object, rewrites object, and loading statuses

2. **Reducer Function**: Handles all state updates through actions like:
   - `LOAD_ARTICLES_SUCCESS` - When articles are loaded
   - `SUMMARIZE_START/SUCCESS/ERROR` - For AI summarization
   - `REWRITE_START/SUCCESS/ERROR` - For article rewriting

3. **Session Persistence**: Automatically saves state to sessionStorage so data persists during the session

4. **Key Functions**:
   - `loadArticles()` - Loads mock articles
   - `summarizeAll()` - Generates summaries for all articles
   - `summarizeOne()` - Summarizes a single article
   - `rewriteOne()` - Creates a simplified rewrite

This pattern ensures all components can access and update article data consistently."

**[Screen: Show the reducer switch statement]**

---

## Part 5: Code Deep Dive - AI Service (6:00 - 8:00)

**[Screen: Open aiService.ts]**

"Now let's examine the AI integration layer. The `aiService.ts` file handles all communication with Ollama."

**[Highlight the key functions]**

"Key components:

1. **Ollama Configuration**:
   - Endpoint: `http://localhost:11434/api/generate`
   - Model: `llama3.2`

2. **Summary Prompt Template**:
   - Instructs AI to create a 2-line TL;DR (max 30 words)
   - Generates 3 key takeaways in bullet points
   - Maintains medical accuracy

3. **Rewrite Prompt Template**:
   - Rewrites articles in simple, beginner-friendly tone
   - Reduces jargon
   - Makes content 20-30% shorter

4. **Response Parsing**:
   - `parseSummary()` - Extracts TLDR and takeaways from AI response
   - Handles formatting variations and sanitizes output

5. **Error Handling**:
   - Fallback mechanisms if Ollama is unavailable
   - Creates basic summaries from article content if AI fails

The service is designed to be resilient - it works even if Ollama isn't running, using fallback logic."

**[Screen: Show the prompt templates and parsing functions]**

---

## Part 6: Code Deep Dive - Navigation & Routing (8:00 - 9:00)

**[Screen: Open AppNavigator.tsx]**

"The navigation is straightforward using React Router. The `AppNavigator.tsx` defines four routes:

1. `/` - Article Loader Screen
2. `/summaries` - Summarizer Screen
3. `/feed` - Feed Screen with pagination
4. `/article/:id` - Individual article detail view

All routes are wrapped in `AppLayout` which provides the navigation header and theme toggle."

**[Screen: Show the routes]**

---

## Part 7: Application Workflow Demonstration (9:00 - 12:00)

**[Screen: Live demo of the application]**

"Now let me show you the application in action:

**Step 1: Loading Articles**
- Click 'Load Articles' button
- Articles are loaded from mock data
- Success message appears

**Step 2: AI Summarization**
- Navigate to Summaries screen
- Click 'Summarize All' to generate summaries for all articles
- Each article shows a loading indicator
- Summaries appear with TLDR and key takeaways
- You can regenerate individual summaries

**Step 3: Feed View**
- Navigate to Feed screen
- See paginated list (10 articles per page)
- Each card shows title, summary, and key takeaways
- Click 'Refresh Summaries' to regenerate all
- Click any article to view details

**Step 4: Article Detail & Rewrite**
- Click an article from the feed
- View original article content
- See existing summary
- Click 'Rewrite in Friendly Tone' button
- AI generates a simplified, beginner-friendly version
- Compare original vs. rewritten text

**Step 5: Manual Upload**
- Go back to Loader screen
- Scroll to 'Manual Article Ingest'
- Fill in title, metadata, and content
- Optionally enable 'Auto-summarize'
- Upload adds article to the system"

**[Screen: Show each step live]**

---

## Part 8: Key Features Highlight (12:00 - 13:30)

**[Screen: Show different features]**

"Let me highlight some key features:

1. **Dark/Light Mode Toggle** - Persistent theme preference
2. **Session Persistence** - Data saved in sessionStorage
3. **Loading States** - Clear feedback during AI operations
4. **Error Handling** - Graceful fallbacks if AI fails
5. **Pagination** - Efficient display of large article sets
6. **Responsive Design** - Works on different screen sizes
7. **Manual Upload** - Add custom articles on the fly
8. **Regeneration** - Retry AI calls for better results"

**[Screen: Demonstrate each feature]**

---

## Part 9: Code Structure Best Practices (13:30 - 14:30)

**[Screen: Show code organization]**

"I followed several best practices:

1. **Separation of Concerns**:
   - Services handle API calls
   - State management is centralized
   - Components are reusable

2. **TypeScript**:
   - Full type safety throughout
   - Prevents runtime errors
   - Better IDE support

3. **Error Boundaries**:
   - Try-catch blocks in async operations
   - Fallback mechanisms
   - User-friendly error messages

4. **Code Reusability**:
   - Shared components
   - Reusable hooks
   - Centralized state

5. **Performance**:
   - useMemo for expensive computations
   - useCallback for stable function references
   - Efficient re-renders"

---

## Part 10: Running the Project (14:30 - 15:30)

**[Screen: Show terminal/command prompt]**

"To run this project:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Ollama** (if using AI features):
   ```bash
   ollama serve
   ollama pull llama3.2
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

The app works offline with mock data, but AI features require Ollama to be running."

**[Screen: Show commands executing]**

---

## Part 11: Challenges & Solutions (15:30 - 16:30)

**[Screen: Show relevant code sections]**

"Some challenges I faced and how I solved them:

1. **AI Response Parsing**:
   - Challenge: AI responses can vary in format
   - Solution: Robust parsing with sanitization and fallbacks

2. **State Management Complexity**:
   - Challenge: Managing multiple async operations
   - Solution: Reducer pattern with clear action types

3. **Error Handling**:
   - Challenge: AI service might be unavailable
   - Solution: Fallback mechanisms that still provide value

4. **Session Persistence**:
   - Challenge: Keeping data between page refreshes
   - Solution: SessionStorage integration in the reducer"

---

## Conclusion (16:30 - 17:00)

**[Screen: Show final app view]**

"In conclusion, this AI Health News Curator demonstrates:
- Modern React development with TypeScript
- AI integration with Ollama
- Clean architecture and code organization
- User-friendly interface with error handling
- Practical solution for health editors

The codebase is well-structured, type-safe, and ready for production use. Thank you for watching!"

**[Screen: Show project summary or credits]**

---

## Tips for Recording:

1. **Screen Recording Setup**:
   - Use clear, readable font sizes in your code editor
   - Zoom in on code sections when explaining
   - Use cursor highlighting if available

2. **Voice Recording**:
   - Speak clearly and at a moderate pace
   - Pause briefly when switching between sections
   - Explain technical terms for clarity

3. **Visual Aids**:
   - Use code highlighting to point out specific sections
   - Show both code and running application
   - Use split screen if possible (code + browser)

4. **Timing**:
   - This script is approximately 17 minutes
   - Adjust based on your speaking pace
   - Add pauses for transitions

5. **Post-Production**:
   - Add text overlays for key points
   - Include chapter markers for easy navigation
   - Add background music (optional, keep it subtle)

---

## Key Code Files to Highlight:

1. `src/App.tsx` - App structure
2. `src/state/ArticleContext.tsx` - State management
3. `src/services/aiService.ts` - AI integration
4. `src/navigation/AppNavigator.tsx` - Routing
5. `src/screens/SummarizerScreen.tsx` - Main feature screen
6. `src/components/AppLayout.tsx` - Layout component

Good luck with your video!

