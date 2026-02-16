const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4242;

app.use(express.json());

// Simple CORS handling for local dev: allow requests from vite dev server origin
app.use((req, res, next) => {
  // You can restrict this in production to your site only
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Allow credentials if needed: res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Simple in-memory store for demo (DO NOT use in prod)
let paidSessions = {};

// Endpoint to create a mock checkout session
app.post('/create-checkout-session', (req, res) => {
  // In production you'd create a Stripe Checkout Session server-side and return the session id
  // For demo, we return a mocked session and mark it unpaid until client confirms
  const sessionId = 'sess_' + Math.random().toString(36).slice(2, 9);
  paidSessions[sessionId] = false;
  res.json({ sessionId, checkoutUrl: `/mock-checkout?sessionId=${sessionId}` });
});

// Mock checkout UI (simple page that 'completes' payment)
app.get('/mock-checkout', (req, res) => {
  const { sessionId } = req.query;
  const html = `
    <html><body style="font-family: sans-serif; padding:2rem">
      <h2>Mock Payment Page</h2>
      <p>Session: ${sessionId}</p>
      <p>This is a demo checkout. Click below to simulate successful payment.</p>
      <form method="POST" action="/mock-complete">
        <input type="hidden" name="sessionId" value="${sessionId}" />
        <button type="submit">Simulate Successful Payment</button>
      </form>
    </body></html>
  `;
  res.send(html);
});

app.post('/mock-complete', express.urlencoded({ extended: true }), (req, res) => {
  const { sessionId } = req.body;
  if (sessionId && paidSessions[sessionId] !== undefined) {
    paidSessions[sessionId] = true;
    res.send(`<html><body style="font-family:sans-serif;padding:2rem"><h2>Payment Successful</h2><p>Return to the app and paste this session id to unlock: <strong>${sessionId}</strong></p></body></html>`);
  } else {
    res.status(404).send('Invalid session');
  }
});

// Endpoint client uses to verify session status
app.get('/session-status/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const ok = !!paidSessions[sessionId];
  res.json({ paid: ok });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
