# ARKON Homepage

Standalone public homepage for ARKON Systems.

## Purpose

This repo is for the public-facing ARKON homepage only. It is intentionally separate from the future ARKON app/backend/dashboard services.

## Direction

- Public marketing homepage first.
- Railway-ready deployment.
- Hostinger can stay as the domain/DNS manager and point the domain to Railway.
- Built around role-specific operational clarity, not AI-agent marketplace positioning.
- Dynamic feel comes from product-story motion: after-hours flow, role views, coverage lanes, dashboard proof, and scroll reveals.
- The real ARKON app, auth, customer data, dashboards, APIs, and database should remain separate services.

## File structure

```txt
ARKON-Homepage/
  index.html
  package.json
  railway.json
  server.js
  vite.config.js
  src/
    App.jsx
    data.js
    main.jsx
    styles.css
```

## Local setup

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Production build

```bash
npm run build
npm start
```

`npm start` serves the generated `dist/` folder using the included Node server.

## Railway deployment

Use these commands in Railway:

```txt
Build command: npm run build
Start command: npm start
```

The server reads Railway's `PORT` environment variable automatically.

## DNS plan

Hostinger should control DNS only:

```txt
arkonsystems.com      -> Railway homepage service
www.arkonsystems.com  -> Railway homepage service
app.arkonsystems.com  -> future ARKON app/dashboard service
```

## Current homepage concept

The homepage presents ARKON as the operating clarity layer for the business day:

> Your business runs better when everyone knows what needs their attention.

It avoids leading with AI/bot language and keeps the focus on customer memory, warm handoffs, role-specific views, and owner visibility.
