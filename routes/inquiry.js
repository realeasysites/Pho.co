const express = require('express');
const db = require('../db');
const { notifyInquiry } = require('../lib/mailer');

const router = express.Router();

const TYPES = ['Catering / Large Order', 'Party Tray', 'General Question', 'Feedback'];
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

// Light per-IP rate limit to slow down spam.
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const list = (hits.get(req.ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (list.length >= 5) return res.status(429).json({ error: 'Too many requests. Please call us instead.' });
  list.push(now);
  hits.set(req.ip, list);
  next();
}

router.post('/inquiry', rateLimit, async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot

  const inq = {
    name: clip(b.name, 100),
    phone: clip(b.phone, 30),
    email: clip(b.email, 120),
    inquiry_type: TYPES.includes(b.inquiry_type) ? b.inquiry_type : 'General Question',
    event_date: clip(b.event_date, 20),
    guest_count: clip(b.guest_count, 20),
    message: clip(b.message, 2000),
  };

  if (!inq.name || !inq.phone) {
    return res.status(400).json({ error: 'Please add your name and phone number.' });
  }

  db.prepare(
    `INSERT INTO inquiries (name, phone, email, inquiry_type, event_date, guest_count, message)
     VALUES (@name, @phone, @email, @inquiry_type, @event_date, @guest_count, @message)`
  ).run(inq);

  notifyInquiry(inq);
  res.json({ ok: true });
});

module.exports = router;
