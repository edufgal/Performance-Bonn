# SPIP · Performance Platform — Telekom Baskets Bonn

## Stack
- **Next.js 14** — React framework + API routes
- **Vercel** — hosting + serverless functions
- **Hawkin Dynamics** — force plate data via OAuth2 API

## Project structure
```
pages/
  index.js          ← main dashboard (tab router)
  api/
    athletes.js     ← Hawkin API endpoint (secure, server-side)
components/
  Layout.jsx        ← TopBar + navigation
  tabs/
    HomeTab.jsx
    RosterTab.jsx
    SCTab.jsx
    PerformanceTab.jsx
    CoachingTab.jsx
    ReportsTab.jsx
data/
  players.js        ← PLAYERS, ROSTER, HK_METRICS (static data)
styles/
  globals.css       ← all CSS
public/
  logo.png          ← Telekom Baskets Bonn logo
```

## Setup

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USER/Performance-Bonn.git
cd Performance-Bonn
npm install
```

### 2. Environment variables
Copy `.env.local.example` to `.env.local` and fill in your Hawkin credentials:
```
HAWKIN_TOKEN_URL=https://...
HAWKIN_API_URL=https://...
HAWKIN_REFRESH_TOKEN=your-token
```

### 3. Add logo
Place your `logo.png` file in the `/public` folder.

### 4. Run locally
```bash
npm run dev
# → http://localhost:3000
```

### 5. Deploy to Vercel
```bash
git add .
git commit -m "Migrate to Next.js"
git push
```
Vercel auto-deploys on every push.

**Important:** Add environment variables in Vercel:
`Settings → Environment Variables → add HAWKIN_TOKEN_URL, HAWKIN_API_URL, HAWKIN_REFRESH_TOKEN`

## API endpoint

### GET /api/athletes
Fetches real athlete roster from Hawkin Dynamics.
- Exchanges refresh token → access token (server-side, secure)
- Calls Hawkin `/athletes` endpoint
- Returns JSON array of athletes
- Cached 5 minutes

## Next steps after deploy
1. Connect `/api/athletes` data to `RosterTab` (replace static ROSTER)
2. Add `/api/tests` for CMJ/SJ test results
3. Add `/api/metrics` for historical metric trends
4. Replace static PLAYERS data with real Hawkin data
