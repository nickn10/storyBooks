require('./config/config');
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('./db/mongoose');
const passport = require('passport');

const publicPath = path.join(__dirname, '../public');
const app = express();

// Mongoose Schemas
const User = require('./models/User');
// PORT
const port = process.env.PORT
// Passport Config
require('./config/passport')(passport);
// Middleware Config
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'secret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
// Load Routes
const auth = require('./routes/auth');
// Use Routes
app.use('/auth', auth);

app.get('/', (req, res) => {
   res.send('Index Page.');
});

app.get('/dashboard', (req, res) => {
   res.send('Dashboard');
});



app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
