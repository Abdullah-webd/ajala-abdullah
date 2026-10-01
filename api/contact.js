// Vercel serverless function: POST /api/contact
// server.js mounts this same handler for local development.
const { Resend } = require('resend');

const MIN_FILL_TIME_MS = 2500; // humans take longer than this to fill three fields
const MAX_LENGTHS = { name: 100, email: 200, message: 5000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Cloudflare Turnstile check. Only enforced once TURNSTILE_SECRET_KEY is set.
async function verifyTurnstile(token, ip) {
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body
  });
  const result = await response.json();
  return result.success === true;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const { name, email, message, website, elapsed, turnstileToken } = req.body || {};

  // Honeypot: the "website" field is hidden from people, so only bots fill it.
  // Answer as if it worked so the bot has no reason to adapt.
  if (website) {
    console.warn('Contact form: honeypot triggered, submission dropped');
    return res.status(200).json({ success: true });
  }

  // Time trap: scripts that post straight to the API send no timing, or submit instantly.
  if (typeof elapsed !== 'number' || elapsed < MIN_FILL_TIME_MS) {
    console.warn('Contact form: time trap triggered, submission rejected');
    return res.status(400).json({ success: false, error: 'That was too quick. Please refresh the page and try again.' });
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string' ||
      !name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ success: false, error: 'Please provide name, email, and message.' });
  }

  if (name.length > MAX_LENGTHS.name || email.length > MAX_LENGTHS.email || message.length > MAX_LENGTHS.message) {
    return res.status(400).json({ success: false, error: 'One of the fields is too long.' });
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return res.status(400).json({ success: false, error: 'Please complete the verification check.' });
    }

    try {
      const forwardedFor = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      const passed = await verifyTurnstile(turnstileToken, forwardedFor);
      if (!passed) {
        console.warn('Contact form: Turnstile verification failed');
        return res.status(400).json({ success: false, error: 'Verification failed. Please try again.' });
      }
    } catch (error) {
      console.error('Turnstile verification error:', error);
      return res.status(502).json({ success: false, error: 'Could not verify the request. Please try again.' });
    }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ success: false, error: 'Email service is not configured.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim());

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ajala Abdullah Portfolio <contact@ajalaabdullah.dev>',
      to: 'webmastersmma@gmail.com',
      replyTo: email.trim(),
      subject: `New Portfolio Message from ${name.trim().replace(/[\r\n]+/g, ' ')}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Message from Portfolio Contact Form</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
