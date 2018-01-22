const mongoose = require('mongoose');
const Story = require('../models/Story');
const User = require('../models/User');

module.exports = async (req,res,next) => {
   try {
      const story = await Story.findById(req.params.id).populate('user');
      if (story.user.id === req.user.id) {
         req.body.owner = true;
      } else {
         req.body.owner = false
      }
      next();
   } catch (e) {
      next();
   }
}