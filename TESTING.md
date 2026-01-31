# DevBrain AI – Manual test checklist

Use this checklist to test all pages at **http://localhost:3000** (run `npm run dev` first).

---

## 1. Dashboard (`/`)

- [ ] Page loads with title "Dashboard" and "Unify Technical Knowledge"
- [ ] "How DevBrain AI solves S4" section shows 3 bullets
- [ ] Three summary cards: Backend status, Total sources, Tasks running (or "Error" if API fails)
- [ ] Quick actions: "Create Source", "Open Unified Search", "Open Chat"
- [ ] No API banner if `VITE_API_BASE_URL=/api` is set (proxy works)
- [ ] Header nav: Dashboard, Health, Sources, Unified Search, Chat, Tasks

---

## 2. Health (`/health`)

- [ ] Page loads with title "Health"
- [ ] Last checked time and "Refresh" button
- [ ] Status: "All systems operational" (green) or "Degraded or unavailable" (red)
- [ ] Response body JSON (api, redis, postgres, workers)
- [ ] If API fails: "Unable to reach backend" and "Retry" button

---

## 3. Sources (`/sources`)

- [ ] Page loads with title "Sources"
- [ ] Buttons: "Demo Mode (create 4 sample sources)", "Create Source"
- [ ] Either: table of sources (name, type, description, updated, View/Delete) or empty state / error state
- [ ] Click "Create Source": modal opens with name, tool type, description, connector fields
- [ ] Click source name or "View": navigates to `/sources/:sourceName`

---

## 4. Source detail (`/sources/:sourceName`)

- [ ] Navigate from Sources by clicking a source name
- [ ] Page shows source name, tool type badge, description, doc count
- [ ] Tabs: Documents, Search, Settings
- [ ] **Documents**: list or "No documents yet"
- [ ] **Search**: input + topK + Search button; results or "Enter a query..."
- [ ] **Settings**: description textarea, "Trigger sync" checkbox, "Update Source" button
- [ ] "← Sources" link back to `/sources`
- [ ] Invalid name: "Source not found or failed to load"

---

## 5. Unified Search (`/search`)

- [ ] Page loads with title "Unified Search"
- [ ] Search input, topK selector, "Search" button
- [ ] View toggle: "Group by Source" / "All Combined"
- [ ] Filter by type: All / docs / code / issues / chats
- [ ] Source chips to select which sources to search
- [ ] Run search: results grouped by source or combined; or "No results found"
- [ ] If sources fail: "Failed to load sources" + Retry

---

## 6. Chat (`/chat`)

- [ ] Page loads with "New conversation" and conversation list (or empty)
- [ ] Top bar: source chips for "Context (sources)"
- [ ] Message input and "Send" button
- [ ] Send a message: user bubble, then "Thinking…", then assistant bubble
- [ ] "Sources / Evidence" section under last answer ("No citations returned" if API doesn’t return refs)
- [ ] "Copy answer" and "Export conversation" buttons
- [ ] If sources fail: "Failed to load sources" in context bar

---

## 7. Tasks (`/tasks`)

- [ ] Page loads with title "Tasks"
- [ ] Table: ID, Status, Type/Progress, Completed, View (or empty/error state)
- [ ] Click task ID or "View": navigates to `/tasks/:taskId`
- [ ] If API fails: "Failed to load tasks" + Retry

---

## 8. Task detail (`/tasks/:taskId`)

- [ ] Navigate from Tasks by clicking a task
- [ ] Page shows task ID, status, completed at, metadata
- [ ] If status PENDING/STARTED: "Terminate Task" with confirm
- [ ] "← Tasks" link back to `/tasks`
- [ ] Invalid ID: "Task not found or failed to load" + Retry

---

## Quick navigation test

Open each URL directly:

- http://localhost:3000/
- http://localhost:3000/health
- http://localhost:3000/sources
- http://localhost:3000/search
- http://localhost:3000/chat
- http://localhost:3000/tasks

Then use the header links to move between pages. All should load without crashing.
