// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const admin = require('./firebaseAdmin.js');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://cap-back.jaideepgrover.blog.com/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userRecord = await admin.auth().getUser(profile.id);
        done(null, userRecord);
      } catch (error) {
        const newUser = await admin.auth().createUser({
          uid: profile.id,
          email: profile.emails[0].value,
          displayName: profile.displayName,
        });
        done(null, newUser);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.uid));
passport.deserializeUser(async (uid, done) => {
  try {
    const user = await admin.auth().getUser(uid);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
