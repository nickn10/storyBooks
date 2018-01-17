require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

const port = process.env.PORT
// Passport Config
require('./config/passport')(passport);
// Load Routes
const auth = require('./routes/auth');

app.get('/', (req, res) => {
   res.send('Index Page.');
});

app.get('/dashboard', (req, res) => {
   res.send('Dashboard');
});

// Use Routes
app.use('/auth', auth);

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});