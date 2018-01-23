const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const validateUser = require('../middleware/validate-login');
const isStoryOwner = require('../middleware/story-owner');

// Public Stories Index
router.get('/', async (req, res) => {
   try {
      const stories = await Story.find({ status: 'public' }).populate('user');
      stories.sort((a, b) => b.date - a.date);
      res.render('stories/index', { stories });
   } catch (e) {
      console.log(e);
      res.redirect('/');
   }
});

// My Stories All
router.get('/my-stories', validateUser, async (req, res) => {
   try {
      let stories;
      let sort = 'All'
      const myStories = await Story.find({user: req.user.id}).populate('user');
      if(req.query.view === 'Public') {
         stories = myStories.filter(story => story.status === 'public');
         sort = 'Public';
      }else if(req.query.view === 'Private') {
         stories = myStories.filter(story => story.status !== 'public');
         sort = 'Private';
      } else {
         stories = myStories;
      }
      stories.sort((a, b) => b.date - a.date);
      res.render('stories/user', { stories, sort });
   } catch (e) {
      console.log(e);
      res.redirect('/');
   }
});

// Add Story Form
router.get('/add', validateUser, (req, res) => {
   res.render('stories/add');
});

// Show Single Story
router.get('/:id', validateUser, isStoryOwner, async (req, res) => {
   try {
      const story = await Story.findById(req.params.id).populate('user');
      res.render('stories/show', {story, owner: req.body.owner});
   } catch (e) {
      res.redirect('/stories');
   }
});
// Edit Story Form
router.get('/edit/:id', validateUser, async (req, res) => {
   try {
      const story = await Story.findById(req.params.id).populate('user');
      res.render('stories/edit', {story});
   } catch (e) {
      res.redirect('/stories');
   }
});
// UPDATE Story
router.put('/:id', isStoryOwner, async (req, res) => {
   if(req.body.owner) {
      try {
         const editedStory = {
            title: req.body.title,
            status: req.body.status,
            allowComments: Boolean(req.body.allowComments),
            body: req.body.body,
            user: req.user._id
         }
         await Story.findByIdAndUpdate({ _id: req.params.id}, {$set:editedStory}, {new: false});
         res.redirect('/stories/my-stories');
      } catch (e) {
         res.redirect('/stories/edit/story.id');
      }
   } else {
      res.redirect('/');
   }
})
// UPDATE Status
router.put('/update-status/:id', isStoryOwner, async(req, res) => {
   if(req.body.owner) {
      try {
         if (req.query.status === 'Make Private') {
            await Story.findByIdAndUpdate(req.params.id, { status: 'private' }, { new: false });
         } else if(req.query.status === 'Make Public') {
            await Story.findByIdAndUpdate(req.params.id, {status: 'public'}, { new: false});
         }
         res.redirect('/stories/my-stories');
      } catch (e) {
         console.log(e);
         res.redirect('/stories/my-stories');
      }
   } else {
      res.redirect('/')
   }
})

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
      res.redirect('/dashboard');
   } catch (e) {
      res.redirect('/stories/add');
   }
});

// DELETE Story
router.delete('/:id', isStoryOwner, async (req, res) => {
   if(req.body.owner) {
      try {
         await Story.findByIdAndRemove({ _id: req.params.id });
         res.redirect('/dashboard')
      } catch (e) {
         console.log(e);
         res.redirect('/dashboard')
      }
   } else {
      res.redirect('/');
   }
});

module.exports = router;