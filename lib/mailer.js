const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_PORT || 465) === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function notifyInquiry(inq) {
  if (!transporter || !process.env.NOTIFY_EMAIL) return;
  const lines = [
    `Name: ${inq.name}`,
    `Phone: ${inq.phone}`,
    `Email: ${inq.email || '-'}`,
    `Type: ${inq.inquiry_type || '-'}`,
    `Date: ${inq.event_date || '-'}`,
    `Guests: ${inq.guest_count || '-'}`,
    '',
    inq.message || '',
  ];
  try {
    await transporter.sendMail({
      from: `"Pho Co. Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      replyTo: inq.email || undefined,
      subject: `New ${inq.inquiry_type || 'website'} inquiry from ${inq.name}`,
      text: lines.join('\n'),
    });
  } catch (err) {
    console.error('Email notify failed:', err.message);
  }
}

module.exports = { notifyInquiry };
