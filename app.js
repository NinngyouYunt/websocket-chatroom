const passport = require("passport");

module.exports = (app) => {
  // Route
  app.get("/", (req, res) => {
    if (!!req.user) {
      console.log(`user is authenticated, session is ${req.session.id}`);
      res.sendFile(`${__dirname}/static/index.html`);
    } else {
      res.sendFile(`${__dirname}/static/login.html`);
    }
  });

  app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }));

  app.post("/logout", (req, res) => {
    console.log(`logout ${req.session.id}`);
    const socketId = req.session.socketId;
    if (socketId && io.of("/live").sockets.get(socketId)) {
      console.log(`forcefully closing socket ${socketId}`);
      io.of("/live").sockets.get(socketId).disconnect(true);
    }
    req.logout();
    res.cookie("connect.sid", "", { expires: new Date() });
    res.redirect("/");
  });

  app.get("/events", (req, res) => {
    res.sendFile(`${__dirname}/config/events.js`);
  });
};
