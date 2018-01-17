const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000

// Load Routes
const auth = require('./routes/auth');

app.get('/', (req, res) => {
   res.send('Index Page.')
})

// Use Routes
app.use('/auth', auth);

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});