const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./User");

module.exports = () => {
  passport.use(new LocalStrategy((username, password, done) => {
    const user = User.findOne(username);
    if (!user) {
      console.log("No User");
      return done(null, false);
    }
    if (!User.validate(username, password)) {
      console.log("bad password");
      return done(null, false);
    }
    delete user.password;
    return done(null, user);
  }));

  passport.serializeUser((user, cb) => {
    console.log(`serializeUser ${user.username}`);
    cb(null, user.username);
  });

  passport.deserializeUser((id, cb) => {
    cb(null, User.findOne(id));
  });
};
