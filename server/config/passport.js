const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
   passport.use(new GoogleStrategy({
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: '/auth/google/callback',
         proxy: true
      }, (accessToken, refreshToken, profile, done) => {
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            const newUser = {
               googleID: profile.id,
               displayName: profile.displayName,
               email: profile.emails[0].value,
               name: {
                  first: profile.name.givenName,
                  last: profile.name.familyName
               },
               image
            }
            User.findOne({googleID: newUser.googleID})
                  .then(user => {
                     if(user) {
                        done(null, user);
                     } else {
                        new User(newUser)
                              .save()
                              .then(user => done(null, user))
                              .catch(e => console.log(e));
                     }
                  })
                  .catch(e => console.log(e));
            

            // passport.serializeUser(function (user, done) {
            //       done(null, user.id);
            // });

            // passport.deserializeUser(function (id, done) {
            //       User.findById(id, function (err, user) {
            //             done(err, user);
            //       });
            // });
            
      })
   )
}