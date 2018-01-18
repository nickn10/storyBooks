require('./config/config');
const path = require('path')
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('./db/mongoose');
const passport = require('passport');

const globalVars = require('./middleware/global-variables');
const publicPath = path.join(__dirname, '../public');
const app = express();

// Mongoose Schemas
const User = require('./models/User');
// PORT
const port = process.env.PORT
// Passport Config
require('./config/passport')(passport);
// Handlebars Config
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
// Middleware Config
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'secret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(globalVars);
// Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);



app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
