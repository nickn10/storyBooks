require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db/mongoose');
const passport = require('passport');
const app = express();

// Mongoose Schemas
const User = require('./models/User');
// PORT
const port = process.env.PORT
// Passport Config
require('./config/passport')(passport);
// Middleware Config
app.use(bodyParser.json());
app.use(passport.initialize());
// app.use(passport.session());
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
