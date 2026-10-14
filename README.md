# Ajala Abdullah Portfolio

A modern, responsive portfolio for an AI Engineer and Web Developer — showcasing production software (Levi AI, RelayFlow, TrustBridge AI, PayWise, Study Master, My School Manager, KizFarm, Naira Games), hackathon results, press coverage, and certifications.

Live: **https://www.ajalaabdullah.dev**

## Features
- **Responsive Design**: Mobile-first layout that works on every screen size.
- **Dynamic Typing Effect**: Hero cycles through roles (AI Engineer, Web Developer).
- **"As Featured In" strip + Recognition section**: Press coverage from Punch, BusinessDay, Naijapreneur and Nidacity, plus hackathon milestones.
- **Project Filtering**: Filter projects by category (AI & Agents, Web Platforms).
- **Interactive Certificates**: Lightbox gallery for viewing certificates.
- **Working Contact Form**: Sends email via a Vercel serverless function using the Resend API.

## Project Structure
- `index.html` — page structure and content.
- `style.css` — styling and responsive rules.
- `script.js` — typing effect, scroll reveals, project filters, lightbox, contact form.
- `api/contact.js` — Vercel serverless function that handles `POST /api/contact` (Resend).
- `vercel.json` — Vercel config (static site + `/api` functions, no build step).
- `server.js` — optional Express server for local development (serves the site and the same contact endpoint).
- `assets/` — images, screenshots and certificates.

## Running Locally

**Option A — Vercel dev (matches production):**
```bash
npm install
npx vercel dev
```

**Option B — Express (no Vercel account needed):**
```bash
npm install
echo "RESEND_API_KEY=re_xxx" > .env
npm start        # http://localhost:3000
```

## Deployment (Vercel)
The site is deployed on **Vercel**. The only environment variable required is:

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | API key for [Resend](https://resend.com), used by `api/contact.js` to deliver contact-form messages |

Set it in the Vercel dashboard (Project → Settings → Environment Variables) or with `vercel env add RESEND_API_KEY`.

To deploy:
```bash
vercel --prod
```

## Author
Ajala Abdullah
