# STUDYVERSE — Starter MVP

A responsive, neon-dark student workspace with a PWA foundation.

## Included in this first milestone
- Responsive dashboard and mobile navigation
- AI Study Room demo interface (not connected to an AI provider)
- Tasks and notes saved locally in the browser
- 25-minute focus timer
- Local audio file player
- Dark/light theme toggle
- PWA manifest and service-worker cache foundation

## Run locally
1. Extract the ZIP.
2. Open the folder in VS Code.
3. For the best experience, install the **Live Server** extension.
4. Right-click `index.html` → **Open with Live Server**.
5. Open the displayed localhost address in Chrome.

For PWA/offline testing, use localhost or HTTPS. Opening `index.html` directly with `file://` will not register the service worker.

## Important before public launch
- AI is a UI demo. Add a backend endpoint and call an AI provider from the server. Never expose API keys in frontend JavaScript.
- Local tasks and notes use browser localStorage on this device only. Add authentication and a database for synced accounts.
- The audio player plays files selected by the user. Add only properly licensed online music sources.
- Guest access expiry, account login history, rate limits, privacy policy and secure authentication are not implemented yet.

## Suggested next milestone
Connect a secure backend, authentication, and one AI provider; then add image question upload and answer formatting.
