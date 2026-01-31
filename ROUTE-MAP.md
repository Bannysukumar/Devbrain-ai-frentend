# DevBrain AI – Route Map

## Public (Marketing)
| Path | Page |
|------|------|
| `/` | Home – hero, features, how it works, testimonials |
| `/about` | About – mission, team, vision |
| `/blog` | Blog – list with search + category |
| `/blog/:slug` | Blog post detail |
| `/resources` | Resources – guides, Hackathon Demo Guide |
| `/contact` | Contact – form, business info |
| `/pricing` | Pricing – Free / Pro / Team cards |

## Auth
| Path | Page |
|------|------|
| `/auth/login` | Login – email/password, remember me, forgot link |
| `/auth/signup` | Signup – name, email, password, terms |
| `/auth/forgot-password` | Forgot password – email, success state |
| `/auth/reset-password` | Reset password (demo) |

## App (protected; sidebar + topbar)
| Path | Page |
|------|------|
| `/app` | Redirects to `/app/dashboard` |
| `/app/dashboard` | KPIs, S4 value prop, quick actions, Demo Mode |
| `/app/sources` | Sources list, create, Demo Mode |
| `/app/sources/:sourceName` | Source detail – Overview, Documents, Search, Settings |
| `/app/search` | Unified search (Ragpi) |
| `/app/chat` | Chat (Ragpi) |
| `/app/cards` | Knowledge Cards |
| `/app/tasks` | Tasks list (Ragpi) |
| `/app/tasks/:taskId` | Task detail, terminate |
| `/app/settings` | Source priority, freshness, prefer recent |
| `/app/health` | Healthcheck (Ragpi) |
| `/app/profile` | Profile (name, email) |

## Admin (admin email from `VITE_ADMIN_EMAIL`)
| Path | Page |
|------|------|
| `/admin` | Redirects to `/admin/dashboard` |
| `/admin/dashboard` | Admin KPIs, latest tasks |
| `/admin/users` | Users list (mock) |
| `/admin/sources` | Sources (reuse app sources) |
| `/admin/audit-logs` | Audit logs (mock) |
| `/admin/site-content` | Blog/site content (mock) |
| `/admin/settings` | Admin toggles (mock) |

## Errors
| Path | Page |
|------|------|
| `/404` | Not found |
| `/500` | Server error |
| `*` | Not found |

---

**Run locally:** `cd devbrain-ai && npm install && npm run dev`  
**Build:** `npm run build`  
**Admin access:** Set `VITE_ADMIN_EMAIL=your@email.com` in `.env` and log in with that email to see Admin in sidebar and access `/admin/*`.
