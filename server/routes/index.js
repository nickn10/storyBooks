const express = require('express');
const router = express.Router();
const moment = require('moment');
const mongoose = require('mongoose');
const Story = require('../models/Story');

const validateUser = require('../middleware/validate-login');

router.get('/', (req, res) => {
   if(req.user) {
      res.redirect('/dashboard')
   } else {
      res.render('index/welcome');
   }   
});

router.get('/dashboard', validateUser, async (req, res) => {
   try {
      const stories = await Story.find({user: req.user});
      stories.sort((a, b) => b.date- a.date);
      res.render('index/dashboard', {stories});
   } catch (e) {
      res.render('index/dashboard');
   }
});

router.get('/about', (req, res) => {
   res.render('index/about')
})
module.exports = router;
