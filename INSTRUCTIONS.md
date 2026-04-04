# PulseWatch — Frontend Updates (API Integration)

These files replace/add to your existing Next.js project to connect it to the real backend.

---

## Step 1 — Add environment variable

Create `.env.local` in your Next.js root:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
For production, change this to your Render URL:
```
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api
```

---

## Step 2 — Copy these files into your project

Copy everything from this folder into your `pulsewatch/` Next.js project,
replacing any existing files with the same path:

```
COPY  api-client/api.ts          →  pulsewatch/lib/api.ts          (NEW)
COPY  api-client/store.tsx       →  pulsewatch/lib/store.tsx       (REPLACE)

COPY  app/(auth)/login/page.tsx           →  same path  (REPLACE)
COPY  app/(auth)/register/page.tsx        →  same path  (REPLACE)
COPY  app/(app)/dashboard/page.tsx        →  same path  (REPLACE)
COPY  app/(app)/websites/page.tsx         →  same path  (REPLACE)
COPY  app/(app)/ssl/page.tsx              →  same path  (REPLACE)
COPY  app/(app)/incidents/page.tsx        →  same path  (REPLACE)
COPY  app/(app)/settings/page.tsx         →  same path  (REPLACE)
COPY  components/layout/AppShell.tsx      →  same path  (REPLACE)
COPY  components/layout/Sidebar.tsx       →  same path  (REPLACE)
COPY  components/ui/AddWebsiteModal.tsx   →  same path  (REPLACE)
```

The files NOT listed here (Button, Input, Badge, Card, etc.) don't need changes.

---

## Step 3 — Run both servers

Terminal 1 — Backend:
```bash
cd pulsewatch-backend
npm run dev
# ✅ MongoDB connected
# 🚀 PulseWatch API running on port 5000
```

Terminal 2 — Frontend:
```bash
cd pulsewatch
npm run dev
# Ready on http://localhost:3000
```

---

## What changed and why

| File | What changed |
|------|-------------|
| `lib/api.ts` | NEW — typed API client with token storage + auto-refresh |
| `lib/store.tsx` | Replaced demo data with real API calls |
| `login/page.tsx` | Calls real `login(email, password)` API |
| `register/page.tsx` | Calls real `register({firstName, lastName, email, password})` API |
| `AppShell.tsx` | Added auth guard + token rehydration loading state |
| `Sidebar.tsx` | Uses `firstName`/`lastName` from real user object |
| `dashboard/page.tsx` | Fetches real dashboard summary + chart data |
| `websites/page.tsx` | Uses `_id` (MongoDB), real check/remove API calls |
| `ssl/page.tsx` | Reads real `site.ssl` and `site.domain` objects |
| `incidents/page.tsx` | Displays real incidents with `timeAgo` formatting |
| `settings/page.tsx` | Calls real profile/password/notifications/delete APIs |
| `AddWebsiteModal.tsx` | Calls real `addSite()` with loading + error states |
