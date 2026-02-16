# ATS Resume Generate — Demo & Payment Integration Guide

This project is a small Vite + React app that shows an ATS-friendly resume generator. The app currently includes a demo payment server (Express) that simulates a checkout flow. The print/download actions are locked until the user completes a payment (demo mode).

Contents
- Quick start (run dev servers)
- Demo purchase flow (popup / mock checkout)
- How the client/server flow works
- How to replace the mock flow with a real payment provider (Stripe example)
- How to fully disable payments (keep buttons locked) for demos

Quick start

```bash
cd ATS-Resume-Generate
npm install
npm run dev
```

- Open the app at http://localhost:5173
- The demo payment server runs on http://localhost:4242

Demo purchase flow (popup)

1. In the app click the `Demo Purchase` button in the toolbar. The client will call the demo server to create a mock checkout session.
2. The demo server returns a relative checkout URL (e.g. `/mock-checkout?sessionId=...`). The client opens this URL in a new popup/tab on the demo server.
3. On the mock checkout page click `Simulate Successful Payment`. The page will show a session id (e.g. `sess_xxx`).
4. Paste that session id into the prompt shown by the client to verify the payment.
5. The client will call the demo server `/session-status/:sessionId`. If the session is marked paid, the client stores `ats_paid=true` in localStorage and enables the Print/Download actions.

Why a popup? The popup simulates the user being redirected to a hosted payment page (like Stripe Checkout) and then returning to the app. Opening the hosted page in a popup keeps the user on the app and matches common checkout UX.

Files involved
- `server/index.js` — demo Express server with mock checkout, session status, and payment completion endpoints.
- `src/App.jsx` — manages `isPaid` state, starts demo purchase and verifies session status.
- `src/components/Editor.jsx` — shows the Download/Print button; when locked it triggers the purchase flow via `onStartPurchase`.

How the flow works (overview)

1. Client requests creation of a checkout session from the server: POST /create-checkout-session.
2. Server returns a checkout URL and a session id. (Mock server stores session in-memory.)
3. Client opens the checkout URL in a popup (hosted by server or external provider).
4. User completes payment on the provider. The server is notified (webhook) and marks session as paid.
5. Client queries session status with GET /session-status/:sessionId to verify the payment.
6. If verified, client sets `ats_paid` in localStorage and enables protected functionality.

Replacing the mock flow with a production payment provider (Stripe example)

Recommended: use Stripe Checkout with server-side session creation and webhook verification.

Server-side (Node/Express) outline:

1. Install Stripe server SDK and add your secret key as an environment variable (STRIPE_SECRET_KEY).
2. Replace `/create-checkout-session` to call `stripe.checkout.sessions.create(...)` with your product, price, and success/cancel URLs. Return the session id (and the redirect URL if you prefer client redirection).
3. Implement a webhook endpoint (e.g., `/webhook`) to receive `checkout.session.completed` events from Stripe, verify the signature, and mark the session as paid in your database.
4. Securely store purchase records (do not rely on client-side flags alone).

Client-side outline:

1. On purchase click, POST to your server's `/create-checkout-session` and receive a session id.
2. Redirect to Stripe Checkout (either by returning the hosted url from server and opening popup, or using Stripe.js client to redirect).
3. After completion, either rely on server notifications or have the client poll/verify the session using a server endpoint that checks your DB.

Security notes
- Never mark purchases paid purely on client-side confirmation. Always verify payment server-side (webhook or server-to-server call).
- Persist purchase state to a backend (DB) associated with a user account. LocalStorage is only suitable for quick demos.

How to disable payments entirely (keep buttons locked)

If you want to ship a demo version without any payment flow, do either:

- Option A (quick): Remove or disable the `Demo Purchase` button in `src/App.jsx`, and ensure `isPaid` is always false. The UI already supports locked state.

- Option B (safe): Keep the demo server but comment out or remove the `/create-checkout-session` endpoint. The client will fail to start checkout and buttons remain locked.

How I integrated this demo so you can hand it to someone else

- The demo server is intentionally minimal and stores session state in memory. It is for local testing only.
- To demo payments to others, have them run `npm install` and `npm run dev` locally. They will see the same mock checkout flow and be able to unlock printing.

If you want me to fully implement Stripe Checkout (server + webhook + README instructions showing environment variables), tell me and I'll:

1. Add real `create-checkout-session` that uses STRIPE_SECRET_KEY (read from .env).
2. Add webhook endpoint with signature verification.
3. Store sessions to a small JSON file or an in-memory object with a secure way to look up by user.
4. Provide final README commands and a small script to run the server with environment variables.

Questions?
- Want me to implement Stripe now, or prefer I leave the mock server and just include integration docs?
# ATS Resume Generate

This is a small Vite + React project that provides an ATS-friendly resume generator. It was split from a single-file React component into a modular structure.

Quick start (macOS / zsh):

```bash
cd ATS-Resume-Generate
npm install
npm run dev
```

Open http://localhost:5173 in your browser.
