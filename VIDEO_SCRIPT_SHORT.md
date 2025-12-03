# Video Script: AI Health News Curator (Short Version)

## Quick Reference Guide

### 1. Introduction (30 sec)
- Show running app
- "AI Health News Curator - helps editors process health articles with AI"

### 2. Tech Stack (1 min)
- React 19 + TypeScript
- Vite for building
- React Router for navigation
- React Context for state
- Ollama 3.2 for AI

### 3. Architecture (1.5 min)
- Show folder structure
- Explain: screens, services, state, components
- Mention: 4 main screens (Loader → Summaries → Feed → Detail)

### 4. Key Code Files (3 min)

**ArticleContext.tsx** (1 min):
- State management with useReducer
- Handles articles, summaries, rewrites
- Session persistence

**aiService.ts** (1 min):
- Ollama API integration
- Two prompts: summary and rewrite
- Error handling with fallbacks

**AppNavigator.tsx** (30 sec):
- 4 routes defined
- React Router setup

### 5. Live Demo (3 min)
1. Load articles → Show success
2. Go to Summaries → Click "Summarize All" → Show loading → Show results
3. Go to Feed → Show paginated list → Click article
4. Article Detail → Show original → Click "Rewrite" → Show simplified version

### 6. Features (1 min)
- Dark/light mode
- Session persistence
- Error handling
- Manual upload
- Regeneration

### 7. Running the Project (1 min)
```bash
npm install
npm run dev
# (Optional) ollama serve
```

### 8. Conclusion (30 sec)
- Summary of what was built
- Technologies used
- Thank you

**Total: ~12 minutes**

---

## Code Snippets to Show:

### ArticleContext.tsx - Reducer
```typescript
const reducer = (state, action) => {
  switch (action.type) {
    case 'SUMMARIZE_START': // Show loading state
    case 'SUMMARIZE_SUCCESS': // Show success
    case 'SUMMARIZE_ERROR': // Show error handling
  }
}
```

### aiService.ts - AI Call
```typescript
async function callOllama(prompt: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({ model: 'llama3.2', prompt })
  })
  return response.json()
}
```

### AppNavigator.tsx - Routes
```typescript
<Routes>
  <Route path="/" element={<ArticleLoaderScreen />} />
  <Route path="/summaries" element={<SummarizerScreen />} />
  <Route path="/feed" element={<FeedScreen />} />
  <Route path="/article/:id" element={<ArticleDetailScreen />} />
</Routes>
```

---

## Recording Checklist:

- [ ] App is running and working
- [ ] Code editor is open with readable font
- [ ] Browser with app is open
- [ ] Ollama is running (optional, for AI demo)
- [ ] Screen recording software is ready
- [ ] Microphone is tested
- [ ] Code files are organized and easy to navigate

---

## What to Emphasize:

1. **Clean Architecture** - Well-organized folder structure
2. **Type Safety** - TypeScript throughout
3. **Error Handling** - Graceful fallbacks
4. **User Experience** - Loading states, error messages
5. **AI Integration** - Seamless Ollama integration
6. **State Management** - Centralized with Context API

