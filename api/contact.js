// Vercel serverless function: POST /api/contact
// Mirrors the Express handler in server.js (kept for local development).
const { Resend } = require('resend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Please provide name, email, and message.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ success: false, error: 'Email service is not configured.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@myschoolmanager.org',
      to: 'webmastersmma@gmail.com',
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Message from Portfolio Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <h3>Message:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
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
