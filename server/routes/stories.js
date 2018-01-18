const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate-login');

// Stories Index
router.get('/', validateUser, (req, res) => {
   res.render('stories/index');
});

// Add Story Form
router.get('/add', validateUser, (req, res) => {
   res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', validateUser, (req, res) => {
   res.render('stories/edit');
});

// Show Single Story
router.get('/:id', validateUser, (req, res) => {
   res.render('stories/show');
});

module.exports = router;