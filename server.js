const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

require('./db'); // initialise database + tables

const adminRoutes = require('./routes/admin');
const inquiryRoutes = require('./routes/inquiry');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Admin first so /admin always asks for the password before anything else.
app.use(adminRoutes);
app.use('/api', inquiryRoutes);

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Pho Co. Variety site running on port ${PORT}`));
