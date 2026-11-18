const path = require('path');
const express = require('express');
const db = require('../db');
const auth = require('../lib/auth');

const router = express.Router();
const views = path.join(__dirname, '..', 'views');
const STATUSES = ['new', 'contacted', 'booked', 'closed'];

router.get('/admin/login', (req, res) => res.sendFile(path.join(views, 'login.html')));

router.post('/admin/login', (req, res) => {
  if (!auth.passwordConfigured()) {
    return res.status(503).json({ error: 'Login is disabled until ADMIN_PASSWORD is set on the server.' });
  }
  if (!auth.checkPassword(req.body && req.body.password)) {
    return res.status(401).json({ error: 'Wrong password.' });
  }
  auth.issueSession(res);
  res.json({ ok: true });
});

router.post('/admin/logout', (req, res) => {
  auth.clearSession(res);
  res.json({ ok: true });
});

router.get(['/admin', '/admin/'], auth.requireAuthPage, (req, res) =>
  res.sendFile(path.join(views, 'admin.html'))
);

router.get('/admin/api/inquiries', auth.requireAuthApi, (req, res) => {
  const rows = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
  res.json(rows);
});

router.patch('/admin/api/inquiries/:id', auth.requireAuthApi, (req, res) => {
  const status = req.body && req.body.status;
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Bad status' });
  db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, Number(req.params.id));
  res.json({ ok: true });
});

router.delete('/admin/api/inquiries/:id', auth.requireAuthApi, (req, res) => {
  db.prepare('DELETE FROM inquiries WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

module.exports = router;
