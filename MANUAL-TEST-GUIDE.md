# DevBrain AI – Manual Test Checklist

Use this checklist to verify each feature after deployment or before demo.

---

## 1. Context-aware Unified Search (`/search`)

- [ ] **Project selector**  
  - Go to Settings → Source metadata; assign a Project (e.g. "Backend") to at least one source.  
  - On Search, open "Project" dropdown; "Backend" appears.  
  - Filter by Project; only sources with that project are listed and searchable.

- [ ] **Tool type filter**  
  - Set "Tool type" to docs/code/issues/chats; only sources of that type are shown and searchable.

- [ ] **Module filter**  
  - In Settings, assign a Module (e.g. "Auth") to a source.  
  - On Search, "Module" dropdown shows "Auth"; filtering by it limits sources.

- [ ] **Debounced search**  
  - Type a query; wait ~400 ms without pressing Enter.  
  - Search runs automatically (no need to click Search).  
  - Clicking "Search" runs search immediately with current query.

- [ ] **Group by Source / All Combined**  
  - Run a query that returns results from multiple sources.  
  - "Group by Source" shows one block per source.  
  - "All Combined" shows a single list with source name and type on each row.

- [ ] **Relevance**  
  - Each result shows "Relevance X%" (or similarity badge).  
  - "Matched: …" shows which query terms matched when available.

- [ ] **Freshness**  
  - Results show "Updated &lt;date&gt;" when backend provides `updated_at`/`created_at`.  
  - If older than Settings → "Possibly outdated" days, a "Possibly outdated" badge appears.

- [ ] **Conflict warning**  
  - When 2+ sources return results for the same query, the amber banner appears:  
    "Potential conflict: check sources".

- [ ] **Source priority & prefer recent**  
  - In Settings, change source priority order and enable "Prefer most recent sources".  
  - Run search; order of sources and/or results reflects priority and recency.

---

## 2. Outdated Knowledge & Consistency (`/settings`, `/search`)

- [ ] **Freshness threshold**  
  - Settings → "Possibly outdated" after (days): set to 90 (or another value).  
  - Save; on Search, results older than that show "Possibly outdated".

- [ ] **Prefer most recent sources**  
  - Toggle on in Settings; save.  
  - Search merged results are sorted by date (newest first) where available.

- [ ] **Source priority**  
  - Reorder (e.g. code → docs → issues → chats) and save.  
  - Search "Group by Source" and merged order follow this priority.

---

## 3. Knowledge Cards (`/cards`)

- [ ] **Create card**  
  - Click "New card"; fill title, summary, tags (comma-separated), optionally add linked source references (source name + URL).  
  - Save; card appears in the list.

- [ ] **List + search + filters**  
  - Multiple cards; use search box to filter by text.  
  - Use "All tags" dropdown to filter by tag.

- [ ] **Pin**  
  - Click pin icon on a card; it moves to top and shows pinned state.  
  - Unpin; order updates (pinned first, then by updated date).

- [ ] **Edit card**  
  - Click edit on a card; change title/summary/tags/refs; save.  
  - Card updates in list.

- [ ] **Delete card**  
  - Click delete; confirm; card is removed.

- [ ] **Export as Markdown**  
  - Click "Export as Markdown" on a card; a `.md` file downloads with title, summary, tags, linked refs, and timestamp.

---

## 4. Trusted AI Answers with Traceability (`/chat`)

- [ ] **Sources Used**  
  - Send a message with one or more sources selected.  
  - Below the answer, "Sources used" lists the source names; each is clickable.

- [ ] **Citation modal**  
  - Click a source in "Sources used"; a modal opens with source info (and note that per-message citations are not yet returned by API).

- [ ] **Confidence meter**  
  - After a reply, a confidence bar and percentage appear (heuristic: sources count + response length).

- [ ] **Not enough info**  
  - Ask a question that returns no or very short answer (or trigger backend "no info" response).  
  - Either the answer text shows "Not enough information in knowledge base" or the amber "Not enough information in knowledge base" badge appears below.

- [ ] **Answer Audit**  
  - After at least one assistant message, click "Answer Audit".  
  - A markdown report downloads with question, answer, sources used, confidence, and timestamp.

- [ ] **Sample questions**  
  - With no messages, a list of sample questions is shown; clicking one fills the input (user can send or edit).

---

## 5. Demo Mode & Dashboard

- [ ] **Demo Mode**  
  - On Dashboard, click "Demo Mode".  
  - Sample sources (docs, code, issues, chats) are created via API; toasts show success/fail.  
  - Sources and Tasks pages show new sources and sync tasks.

- [ ] **S4 value prop**  
  - Dashboard shows "How DevBrain AI solves S4" with three bullets (unified access, semantic search, RAG-powered chat).

---

## 6. Navigation & Responsiveness

- [ ] **Nav**  
  - All links work: Dashboard, Sources, Search, Chat, Knowledge Cards, Settings, Health, Tasks.

- [ ] **Routes**  
  - `/`, `/sources`, `/search`, `/chat`, `/cards`, `/settings`, `/health`, `/tasks`, `/tasks/:taskId`, `/sources/:sourceName`.

- [ ] **Loading / errors / empty**  
  - Loading states (e.g. "Searching…", "Thinking…") appear where expected.  
  - Error states (e.g. failed to load sources) show message and Retry where applicable.  
  - Empty states (no sources, no cards, no results) show clear messages.

---

## 7. Regression (existing flows)

- [ ] **Sources**  
  - Create, view, edit, delete source; view documents; run sync (Tasks).

- [ ] **Health**  
  - Health page shows API, Redis, Postgres, Workers status.

- [ ] **Tasks**  
  - Task list and task detail show status and metadata.

- [ ] **Chat**  
  - New conversation; switch conversations; copy answer; export conversation; send message and receive reply (with backend).

---

*Last updated: DevBrain AI frontend feature set.*
