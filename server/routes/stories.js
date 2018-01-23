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
      const sort = req.query.sort || 'All';
      const myStories = await Story.find({user: req.user.id}).populate('user');
      if(sort === 'Public') {
         stories = myStories.filter(story => story.status === 'public');
      }else if(sort === 'Private') {
         stories = myStories.filter(story => story.status !== 'public');
      } else {
         stories = myStories;
      }
      stories.sort((a, b) => b.date - a.date);
      res.render('stories/my', { stories, sort });
   } catch (e) {
      console.log(e);
      res.redirect('/');
   }
});

// Users Public Stories
router.get('/public/:userId', validateUser, async(req, res) => {
   try {
      let stories;
      const sort = req.query.sort || 'Newest';
      const publicStories = await Story.find({ user: req.params.userId, status: 'public' }).populate('user');
      if(sort === 'Oldest') {
         stories = publicStories.sort((a, b) => a.date - b.date);
      } else if(sort === 'Views') {
         stories = publicStories//.sort((a, b) => a.views - b.views);
      } else {
         stories = publicStories.sort((a, b) => b.date - a.date);; 
      }
      res.render('stories/userPublic', {stories, sort, storiesUser: stories[0].user});
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
      const story = await Story.findById(req.params.id).populate('user')
                                                       .populate('comments.commentUser');
      res.render('stories/show', {story, owner: req.body.owner});
   } catch (e) {
      console.log(e)
      res.redirect('/stories');
   }
});
// Edit Story Form
router.get('/edit/:id', isStoryOwner, async (req, res) => {
   if(req.body.owner) {
      try {
         const story = await Story.findById(req.params.id).populate('user');
         res.render('stories/edit', {story});
      } catch (e) {
         console.log(e)
         res.redirect('/stories');
      }
   } else {
      res.redirect('/');
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
         console.log(e);
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
      res.redirect('/stories/my-stories');
   } catch (e) {
      console.log(e);
      res.redirect('/stories/add');
   }
});

// DELETE Story
router.delete('/:id', isStoryOwner, async (req, res) => {
   if(req.body.owner) {
      try {
         await Story.findByIdAndRemove({ _id: req.params.id });
         res.redirect('/stories/my-stories')
      } catch (e) {
         console.log(e);
         res.redirect('/dashboard')
      }
   } else {
      res.redirect('/');
   }
});

router.post('/comment/:id', validateUser, async (req, res) => {
  try {
     if(req.body.commentBody.length > 0) {
        const newComment = {
           commentBody: req.body.commentBody,
           commentUser: req.user.id
        }
        const story = await Story.findById(req.params.id);
        story.comments.unshift(newComment);
        await story.save();
      }
     res.redirect(`/stories/${req.params.id}`);
  } catch (e) {
     console.log(e)
     res.redirect(`/stories/${story.id}`);
  } 
})

module.exports = router;