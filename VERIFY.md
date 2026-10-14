# Verification map
Live URL: https://www.ajalaabdullah.dev
Deploy: `vercel deploy --prod --yes` (run it as its own command; confirm with `vercel ls` before testing live)
Start for tests: `npm install && PORT=3456 node server.js` with `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` unset (test mode: no emails leave; port 3000 is often taken by another app)
Smoke: `node ~/.claude/skills/ship-verify/scripts/smoke.mjs http://localhost:3456 --out .verify`

## Critical flows
- Single page renders at desktop + mobile with no console errors, overflow or broken images
- Download Resume → `assets/Ajala-Abdullah-Resume.pdf` (designed) returns 200 `application/pdf`; `-ATS.pdf` too
- `POST /api/contact` without `elapsed` → 400 (time trap); with `website` filled → 200 but no email (honeypot); valid body → 200 with Resend id (live only, sends a real email to the owner — label test messages)
- `GET /api/contact` → 405
- Every project "Live App" link returns 200

## Known non-issues
- In test mode a valid submission returns 500 "Email service is not configured" — expected, the key is deliberately unset
