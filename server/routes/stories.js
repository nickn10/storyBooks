const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate-login');

router.get('/', validateUser, (req, res) => {
   res.render('stories/index');
});

module.exports = router;