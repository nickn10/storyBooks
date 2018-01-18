const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate-login');

router.get('/', (req, res) => {
   res.render('index/welcome');
});

router.get('/dashboard', validateUser, (req, res) => {
   res.render('index/dashboard');
});

router.get('/about', (req, res) => {
   res.render('index/about')
})
module.exports = router;
