# DevBrain AI

A professional web dashboard that solves the **S4 problem: Fragmentation of Technical Knowledge Across Development Tools** by unifying access to distributed technical knowledge in one place. It integrates with the [Ragpi](https://github.com/ragpi/ragpi) backend via REST APIs.

## Features

- **Unified access** – One place for docs, code repos, issue trackers, and chat/API data
- **Semantic search** – Search per source or across all sources (grouped or combined)
- **RAG-powered chat** – Ask questions grounded in your knowledge base with source context
- **Tasks monitoring** – View and terminate background sync/ingestion jobs
- **Health** – Backend status and last checked time
- **Demo Mode** – Create 4 sample sources (docs, code, issues, chats) for quick demos

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **UI:** Tailwind CSS (dark theme), responsive layout
- **Routing:** React Router v6
- **Data:** React Query (fetch + cache)
- **Toasts:** react-hot-toast
- **HTTP:** Axios (single API client module)

## Setup

### 1. Install dependencies

```bash
cd devbrain-ai
npm install
```

### 2. Configure environment

Copy the example env and set your Ragpi API base URL:

```bash
cp .env.example .env
```

**Option A – Local dev (recommended, avoids CORS):** Use the Vite proxy so requests go through the same origin:

```env
VITE_API_BASE_URL=/api
```

The dev server proxies `/api/*` to your backend (default: `https://malaysiantradenets.com`). To use a different backend, set `VITE_PROXY_TARGET=https://your-backend.com` and restart the dev server.

**Option B – Direct backend URL:** Use the full backend URL. The Ragpi backend must have CORS enabled for `http://localhost:3000` (see Ragpi `.env`: `CORS_ENABLED=true`, `CORS_ORIGINS=["http://localhost:3000"]`).

```env
VITE_API_BASE_URL=https://malaysiantradenets.com
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
```

Output is in `dist/`. Serve with any static host (e.g. Nginx, Vercel, Netlify).

## Demo Flow (for judges)

1. **Dashboard** – Open `/`. Read the “How DevBrain AI solves S4” bullets. Check summary cards (backend status, sources count, tasks running).
2. **Create sources** – Go to **Sources** → click **Demo Mode** to create 4 sample sources (docs, code, issues, chats). Or click **Create Source** and add one manually (name, tool type, description, connector fields).
3. **Tasks** – Go to **Tasks**. See sync tasks; wait until status is SUCCESS for the new sources.
4. **Unified Search** – Go to **Unified Search**. Enter a query (e.g. “async”), optionally filter by tool type or select sources, click **Search**. Toggle “Group by Source” / “All Combined” to see grouped vs merged results.
5. **Chat** – Go to **Chat**. Optionally select sources in the top bar. Send a message (e.g. “What is React?”). See the answer and “Sources / Evidence” section.
6. **Health** – Go to **Health**. Confirm backend status (green/red), response body, and last checked time.

## Project structure

```
devbrain-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── client.ts      # Ragpi API client
│   │   ├── types.ts       # TS interfaces + getToolTypeFromConnector
│   │   └── sourceForm.ts  # Create payload mapping + demo sources
│   ├── components/
│   │   ├── CreateSourceModal.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Layout.tsx
│   │   ├── Skeleton.tsx
│   │   └── ToolTypeBadge.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Health.tsx
│   │   ├── Sources.tsx
│   │   ├── SourceDetail.tsx
│   │   ├── Search.tsx
│   │   ├── Chat.tsx
│   │   ├── Tasks.tsx
│   │   └── TaskDetail.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## API client

All requests use `VITE_API_BASE_URL`. Functions in `src/api/client.ts`:

- `healthcheck()`
- `listSources()`, `createSource()`, `getSource()`, `updateSource()`, `deleteSource()`
- `listDocuments(sourceName, limit, offset)`, `searchSource(sourceName, query, topK)`
- `unifiedSearch(query, sourceNames, topKPerSource)`
- `chat(payload)`
- `listTasks()`, `getTask(id)`, `terminateTask(id)`

Errors are centralized and surfaced via toasts.

## Security

- No secrets stored in the client; API key (if used) can be set via env or a future auth flow.
- User inputs are sent to the backend as-is; sanitization is the backend’s responsibility. No `dangerouslySetInnerHTML` with user content.

## License

Same as the parent Ragpi project.
