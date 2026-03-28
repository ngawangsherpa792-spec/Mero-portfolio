require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the portfolio static files
app.use(express.static(path.join(__dirname)));

// Rate limiter: max 5 contact requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Nodemailer Transporter ──────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP,
    pass: process.env.app_password,
  },
});

// Verify transporter on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

// ── Contact Form Route ──────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  // Sanitize inputs (strip HTML)
  const sanitize = (str) => str.replace(/<[^>]*>/g, '').substring(0, 2000);
  const safeName    = sanitize(name);
  const safeEmail   = sanitize(email);
  const safeMessage = sanitize(message);

  // Mail options — sent TO you, with sender's email as reply-to
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP}>`,
    to: process.env.SMTP,
    replyTo: safeEmail,
    subject: `📬 New Message from ${safeName} — Portfolio`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #060608; color: #eaeaf0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
        <div style="background: linear-gradient(135deg, #00d4ff22, #8338ec22); padding: 30px; border-bottom: 1px solid rgba(0,212,255,0.2);">
          <h1 style="margin: 0; color: #00d4ff; font-size: 22px; letter-spacing: -0.5px;">New Portfolio Contact</h1>
          <p style="margin: 6px 0 0; color: #8888a0; font-size: 13px;">Someone reached out via ngawang.tech</p>
        </div>
        <div style="padding: 30px;">
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #8888a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; width: 80px;">Name</td>
              <td style="padding: 10px 0; color: #eaeaf0; font-weight: 600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #8888a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 10px 0;"><a href="mailto:${safeEmail}" style="color: #00d4ff; text-decoration: none;">${safeEmail}</a></td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
            <p style="margin: 0 0 8px; color: #8888a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="margin: 0; color: #eaeaf0; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
        <div style="padding: 20px 30px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #555566; text-align: center;">
          Sent via ngawang.tech portfolio contact form
        </div>
      </div>
    `,
  };

  // Auto-reply to sender
  const autoReplyOptions = {
    from: `"Ngawang Sherpa" <${process.env.SMTP}>`,
    to: safeEmail,
    subject: `✅ Got your message, ${safeName}!`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #060608; color: #eaeaf0; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
        <div style="background: linear-gradient(135deg, #00d4ff22, #8338ec22); padding: 30px; border-bottom: 1px solid rgba(0,212,255,0.2);">
          <h1 style="margin: 0; color: #00d4ff; font-size: 22px;">Message Received!</h1>
          <p style="margin: 6px 0 0; color: #8888a0; font-size: 13px;">Ngawang Sherpa — Cybersecurity & AI/ML Specialist</p>
        </div>
        <div style="padding: 30px;">
          <p style="margin: 0 0 16px; color: #eaeaf0;">Hey <strong style="color:#00d4ff;">${safeName}</strong>,</p>
          <p style="margin: 0 0 16px; color: #8888a0; line-height: 1.7;">Thanks for reaching out! I've received your message and will get back to you as soon as possible — usually within 24-48 hours.</p>
          <div style="padding: 16px 20px; background: rgba(0,212,255,0.04); border-left: 3px solid #00d4ff; border-radius: 0 8px 8px 0; margin-top: 20px;">
            <p style="margin: 0; color: #8888a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Your message</p>
            <p style="margin: 0; color: #eaeaf0; font-size: 0.9rem; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
        <div style="padding: 20px 30px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.06); font-size: 11px; color: #555566; text-align: center;">
          &copy; 2026 Ngawang Sherpa &bull; Kathmandu, Nepal
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);
    console.log(`📧 Message from ${safeName} <${safeEmail}> sent successfully.`);
    res.json({ success: true, message: 'Your message has been sent! I\'ll be in touch soon.' });
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

// Fallback — serve index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Portfolio server running at http://localhost:${PORT}`);
});
