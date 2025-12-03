# AI Health News Curator

AI-assisted dashboard that loads health-focused articles, summarizes them with Ollama, and offers a simplified rewrite view for editors.

## Problem Understanding
- Health editors need a quick way to ingest trusted articles, produce TL;DRs with key takeaways, and distribute a polished feed.
- The workflow should be auditable (mock data), transparent (loading/error states), and allow retrying AI calls.
- Editors still need access to the original article plus a friendly rewrite for the general audience.

## Architecture
- **React + Vite + TypeScript** for fast, typed UI development.
- **React Router** (`navigation/AppNavigator.tsx`) controls the 4 screens.
- **Global state** via React Context (`state/ArticleContext.tsx`) stores articles, summaries, rewrites, and loading/error flags per article.
- **AI calls** isolated inside `services/aiService.ts`, pointing to a local Ollama 3.2 endpoint with graceful fallbacks.
- **Mock data** lives in `src/mock/articles.ts` so the app runs offline.
- **Screens** in `src/screens` map 1:1 with the required flow (Loader → Summaries → Feed → Full view).
- **Reusable styles/components** grouped under `src/components` + global styles (`App.css`, `index.css`).

## Project Setup
```bash
pnpm install        # or npm install / yarn
pnpm run dev        # starts Vite dev server
pnpm run build      # type-check + optimized build
pnpm run preview    # serve the production build
```

## Ollama / AI Setup
1. Install [Ollama 3.2](https://ollama.com/download) and run the service locally.
2. Pull a compatible model, e.g. `ollama pull llama3.2`.
3. The UI makes `POST http://localhost:11434/api/generate` calls with the prompts below. Adjust `MODEL_NAME` or base URL in `services/aiService.ts` if needed.

## AI Prompt Iterations
### Prompt 1 — Summary
```
You are a health news summarizer.
Summarize this article into:
1. A 2-line TL;DR (max 30 words)
2. 3 key takeaways in bullet points
Maintain medical accuracy. Keep it readable and neutral.

Article:
{{ARTICLE_CONTENT}}

Format exactly as:
TLDR: <2 lines within 30 words>
TAKEAWAYS:
- <bullet 1>
- <bullet 2>
- <bullet 3>
```
- Iteration highlights: enforced structure (`TLDR`, `TAKEAWAYS`) so parsing stays reliable and UI stays consistent.

### Prompt 2 — Simplified Rewriting
```
Rewrite the following article in a simple, friendly, beginner-level tone.
Avoid medical jargon unless necessary.
Keep it 20–30% shorter.

Text:
{{ARTICLE_CONTENT}}

Format:
REWRITE:
<text>
```
- Iteration highlights: added explicit word reduction guidance and format tag to strip easily.

## Screens & Features
1. **Article Loader** – loads mock JSON, shows CTA + success/error states, and now includes a manual upload form with session persistence.
2. **Manual Upload Form** – paste website title, metadata, and full text to inject ad-hoc stories, then auto-summarize immediately if desired.
3. **Dark / Light Mode Toggle** – header switch updates CSS variables and persists preference.
4. **Subtle Animations** – cards/panels fade-slide into place; buttons have micro-interactions for a more premium feel.
5. **AI Summarizer** – bulk summarize button, per-article loading indicators, regenerate controls, and failure banners.
6. **Feed View** – paginated list (10 per page) with refresh button that re-runs summaries (pull-to-refresh analog).
7. **Full Article View** – displays original text, prior summary, and “Rewrite in a friendly tone” action with its own loading/error tracking.

## Folder Guide
```
src/
  components/      // layout primitives, nav
  screens/         // Loader, Summaries, Feed, Article detail
  services/        // aiService.ts (Ollama glue)
  state/           // context, reducer, shared types
  mock/            // health article dataset
  navigation/      // AppNavigator (React Router)
```

## Screenshots
Add captured UI images here (e.g., `docs/screen-loader.png`, `docs/screen-feed.png`).

## Known Issues
- Ollama calls are browser-side; ensure CORS is allowed or use a proxy for production.
- Summaries are generated sequentially per article; very large datasets may need batching/backoff logic.
- Friendly rewrite does not yet highlight diff vs. original text.

## Improvements
- Add persisted storage (IndexedDB) to keep summaries between sessions.
- Introduce dark mode toggle plus subtle transitions (Framer Motion).
- Integrate real RSS ingestion instead of mock JSON.
- Track model latency/usage metrics for observability.

## Bonus Notes
- Sticky navigation + gradients give interview-ready polish.
- Built-in feed refresh mimics mobile pull-to-refresh UX.
- Context-driven status flags make it easy to plug in toasts or optimistic UI later.

## Run Instructions (TL;DR)
1. `npm install`
2. Make sure Ollama 3.2 is running locally with `ollama serve`.
3. `npm run dev` and open the shown URL.
4. Use the Loader → Summaries → Feed flow, then open any article detail to try the rewrite feature.
5. Optional: in the Loader screen scroll to “Manual article ingest,” paste website data, and tick “auto summarize” to pipeline your own stories. Session storage keeps custom uploads + AI outputs while the tab stays open.
