# DevTinder — Frontend

React 19 + Vite + Tailwind CSS v4 + daisyUI v5 + Redux Toolkit + React Router v7 + Socket.io client.

## Run locally
```bash
npm install
cp .env.example .env     # set VITE_API_URL if backend isn't on localhost:7777
npm run dev
```

## Deploy (Vercel / Netlify)
1. Push this folder to GitHub and import it in Vercel (framework: Vite).
2. Add env var `VITE_API_URL=https://your-backend.onrender.com` (no trailing slash).
3. `vercel.json` / `public/_redirects` make page refresh on routes like `/connections` work.

Backend (Render/Railway) needs: `FRONTEND_URL=https://your-app.vercel.app`, `NODE_ENV=production`,
plus `MONGO_URI`, `JWT_SECRET`, `PORT`.

## Structure
```
src/
  hooks/useTheme.js        dark/light theme hook (localStorage + data-theme)
  components/ui/Icons.jsx  inline SVG icons
  components/ui/States.jsx PageHeader, EmptyState, skeleton loaders
  components/*.jsx         pages (Feed, Login, Chat, ...)
  utils/*Slice.js          Redux Toolkit slices
```
