const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StorySchema = new Schema({
   title: {
      type: String,
      required: true
   },
   body: {
      type: String,
      required: true
   },
   status: {
      type: String,
      required: true
   },
   allowComments: {
      type: Boolean,
      default: true
   },
   comments: [{
      commentBody: {
         type: String,
         required: true
      },
      commentDate: {
         type: Date,
         default: Date.now
      },
      commentUser: {
         type: Schema.Types.ObjectId,
         ref: 'users'
      }
   }],
   user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
   },
   date: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model('stories', StorySchema, 'stories');