import React, { useEffect, useState } from 'react'
import useResumeData from './hooks/useResumeData'
import Editor from './components/Editor'
import Preview from './components/Preview'

export default function App() {
  const [isPaid, setIsPaid] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ats_paid')) === true } catch(e){ return false }
  });
  const [pendingSession, setPendingSession] = useState(null);

  const startDemoPurchase = async () => {
    try {
      // Try the demo server first (local dev). On production (Vercel) this may fail
      // because the demo server isn't deployed. We'll fall back to a client-side
      // mock checkout (static page) that posts a message back to the opener.
      const serverOrigin = `${window.location.protocol}//${window.location.hostname}:4242`;
      try {
        const resp = await fetch(`${serverOrigin}/create-checkout-session`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
        if (!resp.ok) throw new Error('create-checkout-session failed');
        const body = await resp.json();
        if (body.checkoutUrl) {
          // open the mock checkout in a new tab (server-hosted mock)
          window.open(`${serverOrigin}${body.checkoutUrl}`, '_blank');
          // store the session info in-page and let the user verify without a browser prompt
          setPendingSession({ sessionId: body.sessionId, checkoutUrl: body.checkoutUrl, local: false });
          return;
        }
        throw new Error('no checkoutUrl');
      } catch (err) {
        // Fallback: generate a client-side session id and open static mock checkout
        const sessionId = 'sess_' + Math.random().toString(36).slice(2, 9);
        const checkoutUrl = `${window.location.origin}/mock-checkout?sessionId=${encodeURIComponent(sessionId)}`;
        window.open(checkoutUrl, '_blank');
        setPendingSession({ sessionId, checkoutUrl, local: true });
      }
    } catch (err) {
      console.error(err);
      alert('Error starting demo purchase. See console for details.');
    }
  };
  const {
    data,
    setPersonal, setSummary,
    setExpField, addExp, removeExp,
    setEduField, addEdu, removeEdu,
    setSkills,
    setCertField, addCert, removeCert,
  } = useResumeData();

  useEffect(() => {
    document.title = "ATS Resume Generator — Optimized & Instant";
    const setMeta = (n, c) => {
      let m = document.querySelector(`meta[name="${n}"]`);
      if (!m) { m = document.createElement('meta'); m.name=n; document.head.appendChild(m); }
      m.content = c;
    };
    setMeta('description', 'Build a professional ATS-optimized resume in minutes. Single-column, semantic HTML. Download as PDF instantly.');
    setMeta('keywords', 'ATS resume generator, free resume builder, ATS friendly resume, CV builder, job application');
    setMeta('robots', 'index, follow');
    setMeta('viewport', 'width=device-width, initial-scale=1.0');
    setMeta('theme-color', '#c8522a');
  }, []);

  // Listen for messages from the mock-checkout page (static client-side flow)
  useEffect(() => {
    const handler = (e) => {
      // Only accept messages from same origin
      if (e.origin !== window.location.origin) return;
      try {
        const d = e.data || {};
        if (d.type === 'mock-payment' && d.sessionId && pendingSession && d.sessionId === pendingSession.sessionId) {
          setIsPaid(true);
          localStorage.setItem('ats_paid', 'true');
          setPendingSession(null);
          alert('Payment verified (mock). Download/Print unlocked.');
        }
      } catch (err) {
        console.error('message handler', err);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [pendingSession]);

  return (
    <div className="ats-shell" role="application" aria-label="ATS Resume Generator">
      <main className="ats-form-panel" role="main">
        <header className="ats-form-header">
          <h1>ATS Resume<br /><span>Generator</span></h1>
          <p>Optimized for Applicant Tracking Systems</p>
        </header>

        <Editor data={data} setPersonal={setPersonal} setSummary={setSummary}
          setExpField={setExpField} addExp={addExp} removeExp={removeExp}
          setEduField={setEduField} addEdu={addEdu} removeEdu={removeEdu}
          setSkills={setSkills}
          setCertField={setCertField} addCert={addCert} removeCert={removeCert}
          isPaid={isPaid} onStartPurchase={startDemoPurchase} />

      </main>

      <aside className="ats-preview-panel" aria-label="Live resume preview">
        <div className="ats-toolbar" role="toolbar">
          <span className="ats-toolbar-label">Live Preview</span>
          <div className="ats-toolbar-right">
            <span className="ats-badge" title="Single-column, semantic HTML — passes ATS scanners">ATS Friendly</span>
            {!isPaid ? (
              <>
                {/* If a session was created show an in-page verifier, otherwise show the start button */}
                {!pendingSession ? (
                  <button type="button" className="ats-add-btn" onClick={startDemoPurchase}>Demo Purchase</button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem' }}>
                      Session: <code style={{ background: '#f3f3f3', padding: '0.15rem 0.35rem', borderRadius: 4 }}>{pendingSession.sessionId}</code>
                    </div>
                    <button type="button" className="ats-add-btn" onClick={async () => {
                      try {
                        const serverOrigin = `${window.location.protocol}//${window.location.hostname}:4242`;
                        const status = await fetch(`${serverOrigin}/session-status/${encodeURIComponent(pendingSession.sessionId)}`);
                        const sbody = await status.json();
                        if (sbody.paid) {
                          setIsPaid(true);
                          localStorage.setItem('ats_paid', 'true');
                          setPendingSession(null);
                          alert('Payment verified. Download/Print unlocked.');
                        } else {
                          alert('Payment not verified. Make sure you completed the mock checkout and used the correct session id.');
                        }
                      } catch (err) {
                        console.error(err);
                        alert('Error verifying session. See console for details.');
                      }
                    }}>Verify</button>
                    <button type="button" style={{ background: 'transparent', border: '1px solid #ccc', padding: '0.25rem 0.5rem' }} onClick={() => setPendingSession(null)}>Cancel</button>
                  </div>
                )}
              </>
            ) : (
              <span style={{ fontWeight: 700, color: '#2d7a3d' }}>Paid</span>
            )}

            <button type="button" className="ats-print-btn" onClick={() => isPaid ? window.print() : alert('Please purchase to unlock printing/downloading.')}
              aria-label="Print resume as PDF" disabled={!isPaid}>
              {isPaid ? '🖨 Print / PDF' : '🔒 Locked'}
            </button>
          </div>
        </div>
        <Preview data={data} />
      </aside>
    </div>
  )
}
