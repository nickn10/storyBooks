const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate-login');
const Story = require('../models/Story');

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

// POST New Story
router.post('/', validateUser, async (req, res) => {
   try {
      const newStory = {
         title: req.body.title,
         status: req.body.status,
         allowComments: Boolean(req.body.allowComments),
         body: req.body.body,
         user: req.user._id
      }
      const addStory = new Story(newStory);
      await addStory.save();
      res.redirect('/stories');
   } catch (e) {
      res.redirect('/stories/add');
   }
})

module.exports = router;