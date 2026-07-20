require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Resend with the provided API Key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files with explicit MIME types
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  console.log('--- Incoming Contact Form Submission ---');
  console.log('Request body:', req.body);
  
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log('Error: Missing required fields');
    return res.status(400).json({ success: false, error: 'Please provide name, email, and message.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@myschoolmanager.org',
      to: 'webmastersmma@gmail.com',
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

    console.log('Email sent successfully:', data);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback: serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
