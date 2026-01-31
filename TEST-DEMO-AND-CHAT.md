# Quick test: Demo Mode → Chat

**URL:** http://localhost:3000/

## Steps

1. **Open** http://localhost:3000/ in your browser.

2. **Run Demo Mode**
   - On the Dashboard, under "Quick actions", click the **Demo Mode** button (amber).
   - Wait for the toast: *"Demo sources already exist..."* or *"Demo mode done. Check Tasks..."*.
   - (If sources already exist you’ll see 409 in the Network tab – that’s expected.)

3. **Check Tasks**
   - In the top nav, click **Tasks**.
   - Confirm at least one sync task is **completed** (or wait until one completes).
   - If all are still running, wait a minute and refresh.

4. **Test Chat**
   - Click **Chat** in the nav.
   - In the input at the bottom, type a short question (e.g. *What is this project?*) and press Enter.
   - You should get an answer (or a clear error if the backend has no sources/sync).

5. **If Chat returns 400**
   - Ensure the backend (proxy target in `.env`) is running and has at least one source.
   - In **Tasks**, ensure at least one sync has **completed**.
   - Then try Chat again.

---

**One-liner:** Dashboard → **Demo Mode** → **Tasks** (wait for sync) → **Chat** → send a message.
