const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate-login');
const User = require('../models/User');
const Story = require('../models/Story');

// Public Stories Index
router.get('/', validateUser, async (req, res) => {
   try {
      const stories = await Story.find({ status: 'public' }).populate('user');
      res.render('stories/index', { stories });
   } catch (e) {
      console.log(e);
      res.redirect('/');
   }
});

// My Stories All
router.get('/my-stories', validateUser, async (req, res) => {
   try {
      const stories = await Story.find({user: req.user._id}).populate('user');
      res.render('stories/user', { stories });
   } catch (e) {
      res.redirect('/');
   }
})
// My Stories Public Only
router.get('/my-stories/public', validateUser, async (req, res) => {
   try {
      const stories = await Story.find({user: req.user._id, status: 'public'}).populate('user');
      res.render('stories/user', { stories });
   } catch (e) {
      res.redirect('/');
   }
})
// My Stories Private Only
router.get('/my-stories/private', validateUser, async (req, res) => {
   try {
      const stories = await Story.find({user: req.user._id}).populate('user');
      const privateStories = stories.filter(story => story.status !== 'public');
      res.render('stories/user', { stories: privateStories });
   } catch (e) {
      res.redirect('/');
   }
})


// Add Story Form
router.get('/add', validateUser, (req, res) => {
   res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', validateUser, (req, res) => {
   res.render('stories/edit');
});

// Show Single Story
router.get('/:id', validateUser, async (req, res) => {
   try {
      const story = await Story.findById(req.params.id).populate('user');
      res.render('stories/show', {story});
   } catch (e) {
      res.redirect('/stories');
   }
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