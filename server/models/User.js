const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
   googleID: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   displayName: {
      type: String,
      required: true
   },
   name: {
      first: {
         type: String
      },
      last: {
         type: String
      }
   },
   image: {
      type: String
   }
});

module.exports = mongoose.model('User', UserSchema);
