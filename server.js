const http = require("http");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const registerRoute = require("./app");

const { Server } = require("socket.io");
const routeSocket = require("./socket");

const passport = require("passport");
require("./auth/strategy")();

const config = require("./config/config");
// Express
const app = express();

// sessionStore
const FileStore = require('session-file-store')(session);
const fileStoreOptions = {};
const sessionMiddleware = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new FileStore(fileStoreOptions)
});

app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
// create http server
const server = http.createServer(app);

// SocketIO
const io = new Server(server);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("Unauthorized"));
  }
});

registerRoute(app, io);
routeSocket(io);

// register port
server.listen(config.port, () => {
  console.log(`Server Starting on ${config.port}`);
});
