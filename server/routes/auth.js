const express =require('express');
const router = express.Router();
const passport = require('passport')

const validateUser = require('../middleware/validate-login');

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback',
   passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
      res.redirect('/dashboard');
   }
);

router.get('/verify', validateUser, (req, res) => {
   if(req.user) {
      console.log(req.user);
   } else {
      console.log('Unauthorized');
   }
});

router.get('/logout', validateUser, (req, res) => {
   req.logout();
   res.redirect('/');
});
module.exports = router