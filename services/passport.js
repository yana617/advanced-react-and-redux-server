const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
opts.secretOrKey = config.secret;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
  User.findOne({ _id: jwt_payload.sub }, function (err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

passport.use(new LocalStrategy({ usernameField: 'email' },
  function (email, password, done) {
    User.findOne({ email }, async function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      const isVerified = await user.verifyPassword(password);
      if (!isVerified) { return done(null, false); }
      return done(null, user);
    });
  }
));