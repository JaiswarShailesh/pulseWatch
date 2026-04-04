# PulseWatch — Website Monitoring Dashboard

A production-ready Next.js 14 frontend for monitoring websites, SSL certificates, and domain expiry.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Fonts**: Syne + DM Mono (Google Fonts)

## Project Structure

```
pulsewatch/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Register page
│   ├── (app)/
│   │   ├── dashboard/page.tsx    # Main dashboard with charts
│   │   ├── websites/page.tsx     # Website management
│   │   ├── ssl/page.tsx          # SSL & domain expiry tracker
│   │   ├── incidents/page.tsx    # Incidents & alerts
│   │   └── settings/page.tsx     # Account settings
│   ├── globals.css
│   └── layout.tsx                # Root layout with font setup
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          # App wrapper (sidebar + topbar)
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── Topbar.tsx            # Top header bar
│   └── ui/
│       ├── AddWebsiteModal.tsx   # Add website modal
│       ├── Badge.tsx             # Status badges
│       ├── Button.tsx            # Button component
│       ├── Card.tsx              # Card container
│       ├── Input.tsx             # Form input
│       ├── StatCard.tsx          # Dashboard stat card
│       ├── Toast.tsx             # Toast notifications
│       ├── Toggle.tsx            # Toggle switch
│       └── WebsiteCard.tsx       # Website monitoring card
├── hooks/
│   └── useToast.ts               # Toast notification hook
├── lib/
│   ├── store.tsx                 # Global state (React Context)
│   └── utils.ts                  # Helpers + demo data
└── types/
    └── index.ts                  # TypeScript interfaces
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) and log in with the demo credentials:
- **Email**: demo@example.com  
- **Password**: password

## Connecting to a Backend

The app uses a simple React Context store (`lib/store.tsx`) with demo data. To wire it to your real backend:

1. Replace the `login()` function with a real API call (JWT/session)
2. Replace `DEMO_SITES` fetching with `GET /api/sites`
3. Replace `addSite()` with `POST /api/sites`
4. Replace `removeSite()` with `DELETE /api/sites/:id`
5. Replace `checkNow()` with `POST /api/sites/:id/check`

## Features

- ✅ Auth (login / register)
- ✅ Dashboard with response time chart and uptime overview
- ✅ Website management — add, remove, check now, search/filter
- ✅ 30-day uptime history blocks per site
- ✅ SSL & domain expiry tracking with progress bars
- ✅ Incidents & alerts log with filtering
- ✅ Account settings with notification toggles
- ✅ Toast notifications
- ✅ Responsive layout
