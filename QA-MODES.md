# QA / Test Checklist: Application Modes

Use this checklist to validate the three application modes (Current, Demo, Production) and mode switching.

---

## 1. Mode persistence and switching

- [ ] **Persist after refresh**  
  Set mode to Demo in Profile → Apply → Refresh page. Mode badge in topbar should still show "DEMO" and Demo banner should appear.

- [ ] **Per-user persistence**  
  If multiple users (different emails) are used, each should have their own stored mode (key: `devbrain_mode_<userIdOrEmail>`).

- [ ] **Apply mode confirmation**  
  On Profile, select a different mode and click "Apply mode". Confirm modal appears; on "Apply", mode updates and badge/banners reflect the new mode.

- [ ] **No crashes on switch**  
  Switch between Current → Demo → Production → Current. No console errors or blank screens; Sources, Search, Chat, Tasks load correctly after each switch.

---

## 2. Current mode (default)

- [ ] **Neutral badge**  
  Topbar shows "Current" badge (neutral style).

- [ ] **No demo banner**  
  No Demo or Production banner; only "API not configured" if `VITE_API_BASE_URL` is missing.

- [ ] **Existing behavior**  
  Uses `VITE_API_BASE_URL`; no auto-seeding; "Demo Mode" button on Dashboard creates sources via API as before.

- [ ] **Unchanged flows**  
  Create source, delete source (with confirmation), search, chat, tasks, terminate task work as before.

---

## 3. Demo mode (judge-ready)

- [ ] **Demo banner**  
  Banner: "Demo Mode: Sample knowledge is loaded for demonstration."

- [ ] **Demo offline sub-message**  
  When backend is unreachable: "Backend offline — running in Demo Offline mode with local sample data."

- [ ] **Topbar badge**  
  Topbar shows "DEMO" badge (amber style).

- [ ] **Demo Guide (Dashboard)**  
  Dismissible "Demo Guide" panel on Dashboard with steps 1–4 (Sources, Search, Chat, Tasks + Health). Dismiss and refresh; guide stays dismissed (localStorage).

- [ ] **Load Demo Data (Dashboard)**  
  "Load Demo Data" button visible on Dashboard. Click: creates sources via API when backend is up, or uses local demo data when backend is down; no crash.

- [ ] **Suggested queries (Search)**  
  Search page shows "Suggested queries (Demo)" with e.g. "How do we deploy?", "Where is auth documented?", "What was the incident fix?".

- [ ] **Suggested questions (Chat)**  
  Chat page shows demo suggested questions (e.g. "How do we deploy?", "Where is auth documented?").

- [ ] **Demo data when backend down**  
  With backend off or unreachable: Sources list shows demo sources; Search returns demo results; Chat returns demo answers with citations; Tasks shows demo tasks.

- [ ] **Demo data looks realistic**  
  Sample content includes onboarding notes, architecture overview, incident excerpt, issue ticket, README snippets; clearly demo where needed.

- [ ] **Complete functionality in Demo**  
  Sources list has entries; Search returns results; Chat returns answers (with citations when offline); Tasks page shows tasks (real or demo).

---

## 4. Production mode (real-world)

- [ ] **Strict banner**  
  When API is configured: "Production Mode: connected to live knowledge sources." (emerald style).

- [ ] **Blocking error when no API**  
  When `VITE_API_BASE_URL` is not set: full-screen error "Production Mode requires API" with link to Profile to switch mode. No app content visible.

- [ ] **No demo seed buttons**  
  Dashboard and Sources do not show "Load Demo Data" or "Demo Mode" in Production.

- [ ] **Delete source confirmation**  
  On Sources, click Delete on a source. Confirmation modal appears; Cancel/Delete work; no delete without confirmation.

- [ ] **Terminate task confirmation**  
  On Task detail, click "Terminate task". Confirmation modal appears; Cancel/Yes work; no terminate without confirmation.

- [ ] **Prefer most recent default**  
  Search (and settings) treat "Prefer most recent sources" as ON by default in Production (if the toggle exists).

- [ ] **Admin-only (optional)**  
  If role exists, only admins can manage sources delete/update in Production; optional per your setup.

---

## 5. Badges and banners

- [ ] **Current**  
  Topbar: "Current" (neutral). No mode banner (unless API not configured).

- [ ] **Demo**  
  Topbar: "DEMO" (amber). Banner: Demo Mode + optional "Backend offline…".

- [ ] **Production**  
  Topbar: "Production" (emerald). Banner: "Production Mode: connected to live knowledge sources." or blocking screen if no API.

---

## 6. Edge cases

- [ ] **Backend slow**  
  In Demo mode, slow backend: after timeout/error, app falls back to demo dataset; banner shows "Demo Offline"; no crash.

- [ ] **Switch mode while on Search/Chat**  
  Switch from Demo to Production (or vice versa) while on Search or Chat page. Page refetches with correct adapter; no stale data or errors.

- [ ] **Profile when not logged in**  
  If Profile is accessible without user, mode switcher may use "anonymous"; no crash.

---

## Quick 1-minute demos

- **Current:** Profile → Current → Apply. Use app as usual; badge "Current".
- **Demo:** Profile → Demo → Apply. See Demo banner, Demo Guide on Dashboard, "Load Demo Data", suggested queries on Search and Chat. Optional: turn off backend to see "Demo Offline" and local data.
- **Production:** Set `VITE_API_BASE_URL` in `.env` → Profile → Production → Apply. See Production banner and confirmations on delete/terminate. Remove `VITE_API_BASE_URL` and refresh to see blocking error screen.
